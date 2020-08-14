/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import fs = require("fs");
import path = require("path");
import * as vscode from "vscode";
import * as JenkinsIndicator from "./JenkinsIndicator";
import { Setting } from "./setting";
import { registerWhatsNew } from "./whats-new/commands";
import { Container } from "./container";

export function activate(context: vscode.ExtensionContext) {
    Container.context = context;

    let jenkinsIndicator: JenkinsIndicator.JenkinsIndicator;
    let jenkinsController: JenkinsIndicator.JenkinsIndicatorController;

    let currentSettings: Setting[];

    // Set GIT hook to get branch when jenkins URL is a Multi branch project
    let gitBranch = ""
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    const gitApi = gitExtension.getAPI(1);
    const setGitBranch = (repo) => {
        if (!repo) return

        repo.state.onDidChange(() => {
            const branchName = repo.state.HEAD.name
            if (gitBranch === branchName) return;

            gitBranch = branchName
            updateStatus()
        })

        gitBranch = repo.state.HEAD.name
    }

    // Set branch with git api, if not initialized setup the open hook
    if (gitApi.state !== "initialized") {
        gitApi.onDidOpenRepository((repo) => {
            setGitBranch(repo)
        })
    } else {
        setGitBranch(gitApi.repositories[0])
    }

    if (hasJenkinsInAnyRoot()) {
        createJenkinsIndicator(context);
        updateStatus();
    }

    registerWhatsNew();

    const dispUpdateStatus = vscode.commands.registerCommand("jenkins.updateStatus", () => updateStatus(true));
    context.subscriptions.push(dispUpdateStatus);

    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => {
        if (hasJenkinsInAnyRoot()) {
            createJenkinsIndicator(context);
        }
        updateStatus()
    }
    ));

    const dispOpenInJenkins = vscode.commands.registerCommand("jenkins.openInJenkins", async () => {
        if (!hasJenkinsInAnyRoot()) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        }

        const settings = currentSettings;
        if (!settings.length) {
            vscode.window.showWarningMessage("The current project is not enabled for Jenkins. Please review .jenkins file.");
            return;
        }

        if (settings.length > 1) {
            vscode.window.showQuickPick(settings.map(setting => setting.name ? setting.name : setting.url), {
                placeHolder: "Select the Jenkins job to open in browser"
            }).then((settingName: string) => {
                vscode.commands.executeCommand("Jenkins." + settingName + ".openInJenkins");
            });
        } else {
            vscode.commands.executeCommand("Jenkins." + settings[0].name + ".openInJenkins");
        }
    });
    context.subscriptions.push(dispOpenInJenkins);

    const dispOpenInJenkinsConsoleOutput = vscode.commands.registerCommand("jenkins.openInJenkinsConsoleOutput", async () => {
        if (!hasJenkinsInAnyRoot()) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        }

        const settings = await getCurrentSettings();
        if (!settings.length) {
            vscode.window.showWarningMessage("The current project is not enabled for Jenkins. Please review .jenkins file.");
            return;
        }

        if (settings.length > 1) {
            vscode.window.showQuickPick(settings.map(setting => setting.name ? setting.name : setting.url), {
                placeHolder: "Select the Jenkins job to open in browser"
            }).then((settingName: string) => {
                vscode.commands.executeCommand("Jenkins." + settingName + ".openInJenkinsConsoleOutput");
            });
        } else {
            vscode.commands.executeCommand("Jenkins." + settings[0].name + ".openInJenkinsConsoleOutput");
        }
    });
    context.subscriptions.push(dispOpenInJenkinsConsoleOutput);

    function createJenkinsIndicator(aContext: vscode.ExtensionContext) {
        if (jenkinsIndicator) {
            return;
        }

        jenkinsIndicator = new JenkinsIndicator.JenkinsIndicator();
        jenkinsController = new JenkinsIndicator.JenkinsIndicatorController(jenkinsIndicator);
        aContext.subscriptions.push(jenkinsController);
        aContext.subscriptions.push(jenkinsIndicator);
    }

    async function updateStatus(showMessage?: boolean) {
        if (showMessage && !hasJenkinsInAnyRoot()) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        }

        if (jenkinsIndicator) {
            currentSettings = await jenkinsIndicator.updateJenkinsStatus(await getCurrentSettings(), registerCommand, deRegisterCommand, gitBranch);
        }
    }

    // let interval;
    const polling: number = vscode.workspace.getConfiguration("jenkins").get("polling", 0);
    if (polling > 0) {
        setInterval(() => updateStatus(), polling * 60000);
    }

    function hasJenkinsInAnyRoot(): boolean {
        if (!vscode.workspace.workspaceFolders) return false;

        let hasAny = false;
        for (const element of vscode.workspace.workspaceFolders) {
            // const element: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[index];
            hasAny = !!getConfigPath(element.uri.fsPath);
            if (hasAny) {
                return hasAny;
            }
        }

        return hasAny;
    }

    async function getCurrentSettings(): Promise<Setting[]> {
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }

        let settings: Setting[] = [];

        try {
            for (const element of vscode.workspace.workspaceFolders) {
                const jenkinsSettingsPath = getConfigPath(element.uri.fsPath);
                if (jenkinsSettingsPath !== "") {
                    let jenkinsSettings = await readSettings(jenkinsSettingsPath);
                    jenkinsSettings = Array.isArray(jenkinsSettings) ? jenkinsSettings : [jenkinsSettings];
                    settings = settings.concat(jenkinsSettings);
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage("Error while retrieving Jenkins settings");
        }

        return settings;
    }

    async function readSettings(jenkinsSettingsPath: string) {
        if (jenkinsSettingsPath.endsWith(".jenkinsrc.js")) {
            delete require.cache[require.resolve(jenkinsSettingsPath)];
            return await require(jenkinsSettingsPath);
        } else {
            const content = fs.readFileSync(jenkinsSettingsPath, "utf-8");
            return JSON.parse(content);
        }
    }

    function registerCommand(cmd: string, callback: () => void) {
        const command = vscode.commands.registerCommand(cmd, callback);
        context.subscriptions.push(new Command(cmd, command));
    }

    function deRegisterCommand(cmd: string) {
        let foundIndex = -1;
        for (let index = 0; index < context.subscriptions.length; index++) {
            const subscription = context.subscriptions[index];
            if (subscription instanceof Command) {
                if (subscription.cmdId === cmd) {
                    subscription.dispose();
                    foundIndex = index;
                    break;
                }
            }
        }

        if (foundIndex > -1) {
            context.subscriptions.splice(foundIndex, 1);
        }
        return;
    }

    function getConfigPath(root: string): string {
        if (fs.existsSync(path.join(root, ".jenkinsrc.js"))) {
            return path.join(root, ".jenkinsrc.js");
        } else if (fs.existsSync(path.join(root, ".jenkins"))) {
            return path.join(root, ".jenkins");
        }
        return "";
    }

    function createWatcher(folder: vscode.WorkspaceFolder) {
        const fileSystemWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folder, "*.{jenkins,jenkins.js}"));
        fileSystemWatcher.onDidChange(() => updateStatus(false), context.subscriptions);
        fileSystemWatcher.onDidCreate(() => updateStatus(false), context.subscriptions);
        fileSystemWatcher.onDidDelete(() => updateStatus(false), context.subscriptions);
        context.subscriptions.push(fileSystemWatcher);
    }
    vscode.workspace.workspaceFolders.forEach(folder => createWatcher(folder));
}

class Command {
    constructor(public cmdId: string, private command: vscode.Disposable) { }
    public dispose() {
        return this.command.dispose();
    }
}