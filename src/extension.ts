/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import fs = require("fs");
import path = require("path");
import * as vscode from "vscode";
import * as JenkinsIndicator from "./JenkinsIndicator";

export function activate(context: vscode.ExtensionContext) {
    let jenkinsIndicator: JenkinsIndicator.JenkinsIndicator;
    let jenkinsController: JenkinsIndicator.JenkinsIndicatorController; 
    let hasJenkinsInRoot: boolean;    
    
    hasJenkinsInRoot = hasJenkinsInAnyRoot();
    if (hasJenkinsInRoot) {
        createJenkinsIndicator(context);
        updateStatus();
    }

    const dispUpdateStatus = vscode.commands.registerCommand("jenkins.updateStatus", () => updateStatus(true));
    context.subscriptions.push(dispUpdateStatus);

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => {
        if (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 1)) {
            updateStatus(true)
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(e => {
        hasJenkinsInRoot = hasJenkinsInAnyRoot();
        if (hasJenkinsInRoot) {
            createJenkinsIndicator(context);
        }
        updateStatus()}
    ));

    const dispOpenInJenkins = vscode.commands.registerCommand("jenkins.openInJenkins", () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        } 

        const settings = this.getCurrentSettings();
        if (!settings.length) {
            vscode.window.showWarningMessage("The current project is not enabled for Jenkins. Please review .jenkins file.");
            return;
        }

        if (settings.length > 1) {
            vscode.window.showQuickPick(settings.map(setting => setting.name), {
                placeHolder : "Select the Jenkins job to open in browser"
            }).then((settingName: string) => {
                vscode.commands.executeCommand("Jenkins." + settingName + ".openInJenkins");
            });
        } else {
            vscode.commands.executeCommand("Jenkins." + settings[0].name + ".openInJenkins");
        }        
    });
    context.subscriptions.push(dispOpenInJenkins);

    const dispOpenInJenkinsConsoleOutput = vscode.commands.registerCommand("jenkins.openInJenkinsConsoleOutput", () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        } 

        const settings = this.getCurrentSettings();
        if (!settings.length) {
            vscode.window.showWarningMessage("The current project is not enabled for Jenkins. Please review .jenkins file.");
            return;
        }

        if (settings.length > 1) {
            vscode.window.showQuickPick(settings.map(setting => setting.name), {
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

    function updateStatus(showMessage?: boolean) {
        if (!hasJenkinsInRoot && showMessage) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        }

        if (jenkinsIndicator) { 
            jenkinsIndicator.updateJenkinsStatus(getCurrentSettings(), registerCommandForGivenSetting);
        }
    };
    
    // let interval;
    const polling: number = vscode.workspace.getConfiguration("jenkins").get("polling", 0);
    if (polling > 0) {
        setInterval(updateStatus, polling * 60000);
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

    function getCurrentSettings(): any[] {
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }

        let settings = [];
        for (const element of vscode.workspace.workspaceFolders) {
            const jenkinsSettingsPath = getConfigPath(element.uri.fsPath);            
            if (!!jenkinsSettingsPath) {
                let jenkinsSettings = require(jenkinsSettingsPath);
                jenkinsSettings = Array.isArray(jenkinsSettings) ? jenkinsSettings : [jenkinsSettings];
                settings = settings.concat(jenkinsSettings);
            }
        }

        return settings;
    }

    function registerCommandForGivenSetting(cmd: string, callback: () => void) {
        context.subscriptions.push(vscode.commands.registerCommand(cmd, callback));
    }
}

function getConfigPath(root: string): string {
    if (fs.existsSync(path.join(root, ".jenkinsrc.js"))) {
        return path.join(root, ".jenkinsrc.js");
    } else if (fs.existsSync(path.join(root, ".jenkins"))) {
        return path.join(root, ".jenkins");
    }
    return "";
}
