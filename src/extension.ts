/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import fs = require("fs");
import path = require("path");
import * as vscode from "vscode";
import { WhatsNewManager } from "../vscode-whats-new/src/Manager";
import * as JenkinsIndicator from "./JenkinsIndicator";
import { Setting } from "./setting";
import { WhatsNewJenkinsStatusContentProvider } from "./whats-new/JenkinsStatusContentProvider";

export function activate(context: vscode.ExtensionContext) {
    let jenkinsIndicator: JenkinsIndicator.JenkinsIndicator;
    let jenkinsController: JenkinsIndicator.JenkinsIndicatorController; 

    let currentSettings: Setting[];
    
    if (hasJenkinsInAnyRoot()) {
        createJenkinsIndicator(context);
        updateStatus();
    }

    const provider = new WhatsNewJenkinsStatusContentProvider();
    const viewer = new WhatsNewManager(context).registerContentProvider("jenkins-status", provider);
    viewer.showPageInActivation();
    context.subscriptions.push(vscode.commands.registerCommand("jenkins.whatsNew", () => viewer.showPage()));
    
    const dispUpdateStatus = vscode.commands.registerCommand("jenkins.updateStatus", () => updateStatus(true));
    context.subscriptions.push(dispUpdateStatus);

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => {
        if (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 1)) {
            updateStatus(true)
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(e => {
        if (hasJenkinsInAnyRoot()) {
            createJenkinsIndicator(context);
        }
        updateStatus()}
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
                placeHolder : "Select the Jenkins job to open in browser"
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
                placeHolder : "Select the Jenkins job to open in browser"
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
            currentSettings = jenkinsIndicator.updateJenkinsStatus(await getCurrentSettings(), registerCommand, deRegisterCommand);
        }
    };
    
    // let interval;
    const polling: number = vscode.workspace.getConfiguration("jenkins").get("polling", 0);
    if (polling > 0) {
        setInterval(() => updateStatus(), polling * 60000);
    }

    function hasJenkinsInAnyRoot(): boolean {

        if (!vscode.workspace.workspaceFolders) {
            return false;
        }

        let hasAny: boolean = false;

        // for (let index = 0; index < vscode.workspace.workspaceFolders.length; index++) {
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
                if (!!jenkinsSettingsPath) {
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
}

class Command {
    constructor(public cmdId: string, private command: vscode.Disposable) {}
    public dispose(): any {
        return this.command.dispose();
    }
}