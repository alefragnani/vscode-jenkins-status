/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import * as Jenkins from "./Jenkins";

export class JenkinsIndicator {

    private statusBarItems: {[settingName: string]: vscode.StatusBarItem} = {};

    public dispose() {
        this.hideReadOnly();
    }

    public updateJenkinsStatus(settings: any[], registerCommandForGivenSetting: (cmd: string, callback: () => void ) => void) {        
        let noNameCount = -1;
        for (let index = 0; index < settings.length; index++) {
            const setting = settings[index];
            if (!(setting.name)) {
                noNameCount++;
                setting.name = "Jenkins " + (noNameCount ? noNameCount : "");
            }

            // Create as needed
            if (!this.statusBarItems[setting.name]) {
                this.statusBarItems[setting.name] = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
                registerCommandForGivenSetting("Jenkins." + setting.name + ".openInJenkins", () => {
                    vscode.env.openExternal(vscode.Uri.parse(setting.url));
                });
                registerCommandForGivenSetting("Jenkins." + setting.name + ".openInJenkinsConsoleOutput", () => {
                    jjj.getStatus(url, user, pw)
                    .then((status) => {
                        if (status.connectionStatus === Jenkins.ConnectionStatus.Connected) {
                            vscode.env.openExternal(vscode.Uri.parse(setting.url + status.buildNr.toString() + "/console"));
                        } else {
                            vscode.window.showWarningMessage("The Jenkins job has some connection issues. Please check the status bar for more information.");     
                        }   
                    });
                });

                this.statusBarItems[setting.name].command = "Jenkins." + setting.name + ".openInJenkins";
            }

            let jjj: Jenkins.Jenkins;
            jjj = new Jenkins.Jenkins();

            const url = setting.url;
            const user = setting.username ? setting.username : "";
            const pw = setting.password ? setting.password : "";

            if (setting.strictTls !== undefined) {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = setting.strictTls ? "1" : "0";
            }

            // invalid URL
            if (!url) {
                this.statusBarItems[setting.name].tooltip = "No URL Defined";
                this.statusBarItems[setting.name].text = "Jenkins $(x)";
                this.statusBarItems[setting.name].show();
                continue;
            }     
            
            jjj.getStatus(url, user, pw)
                .then((status) => {

                    let icon: string;
                    let tooltip = 
                            "Job Name: " + status.jobName + "\n" +
                            "Status: " + status.statusName + "\n" +
                            "URL: " + status.url + "\n" +
                            "Connection Status: " + status.connectionStatusName;
                    
                    if (status.buildNr !== undefined) {
                        tooltip = tooltip + "\n" + 
                        "Build #: " + status.buildNr;
                    }

                    if (status.code !== undefined) {
                        tooltip = tooltip + "\n" + 
                        "Code #: " + status.code;
                    }

                    switch (status.status) {
                        case Jenkins.BuildStatus.InProgress:
                            icon = " $(pulse)";
                            break;

                        case Jenkins.BuildStatus.Success:
                            icon = "$(check) ";
                            break;

                        case Jenkins.BuildStatus.Failed:
                            icon = "$(alert) ";
                            break;
                    
                        default:
                            icon = "$(stop) ";
                    }
                        
                    this.statusBarItems[setting.name].text = icon + setting.name;
                    this.statusBarItems[setting.name].tooltip = tooltip;
                    this.statusBarItems[setting.name].show();
                });
        }            
    }

    public hideReadOnly() {
        for (const key in this.statusBarItems) {
            if (this.statusBarItems.hasOwnProperty(key)) {
                const statusBarItem = this.statusBarItems[key];
                statusBarItem.dispose();                
            }
        }
    }
}

export class JenkinsIndicatorController {

    private jenkinsIndicator: JenkinsIndicator;
    private disposable: vscode.Disposable;
    // private _isControlled: boolean = false;

    constructor(indicator: JenkinsIndicator) {
        const myself = this;
        this.jenkinsIndicator = indicator;
    }

    public dispose() {
        this.disposable.dispose();
    }
}