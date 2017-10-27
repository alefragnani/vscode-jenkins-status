'use strict'

import * as vscode from 'vscode';
import fs = require('fs');
import * as Jenkins from './Jenkins';
import path = require('path');

export class JenkinsIndicator {

    private statusBarItem: vscode.StatusBarItem;
    private currentStatus: Jenkins.JenkinsStatus = <Jenkins.JenkinsStatus>{};

    dispose() {
        this.hideReadOnly();
    }

    public updateJenkinsStatus() {

        return new Promise((resolve, reject) => {
            // Create as needed
            if (!this.statusBarItem) {
                this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            }

            let jjj: Jenkins.Jenkins;
            jjj = new Jenkins.Jenkins;


            let url: string;
            let user: string;
            let pw: string;
            let settings = JSON.parse(fs.readFileSync(path.join(vscode.workspace.rootPath, '.jenkins')).toString());
            url = settings.url;
            user = settings.username ? settings.username : "";
            pw = settings.password ? settings.password : "";

            // invalid URL
            if (!url) {
                this.statusBarItem.tooltip = 'No URL Defined';
                this.statusBarItem.text = 'Jenkins $(x)';
                this.statusBarItem.show();
                this.currentStatus = <Jenkins.JenkinsStatus>{};
                resolve(true);
                return;
            }            
        
            jjj.getStatus(url, user, pw)
                .then((status) => {

                    let icon: string;
                    this.currentStatus = status;

                    switch (status.status) {
                        case Jenkins.BuildStatus.Sucess:
                            icon = ' $(check)';
                            this.statusBarItem.tooltip = 
                                'Job Name: ' + status.jobName + '\n' +
                                'URL.....: ' + status.url + '\n' +
                                'Build #.: ' + status.buildNr; 
                            break;

                        case Jenkins.BuildStatus.Failed:
                            icon = ' $(x)';
                            if (status.connectionStatus == Jenkins.ConnectionStatus.AuthenticationRequired) {
                                this.statusBarItem.tooltip = 
                                    'Job Name: ' + status.jobName + '\n' +
                                    '<<Authenthication Required>>'; 
                            } else {
                                this.statusBarItem.tooltip = 
                                    'Job Name: ' + status.jobName + ' -- (FAILED)\n' +
                                    'URL.....: ' + status.url + '\n' +
                                    'Build #.: ' + status.buildNr;
                            }
                            break;
                    
                        default:
                            icon = ' $(stop)';
                            this.statusBarItem.tooltip = 
                                'Job Name: ' + status.jobName + '\n' +
                                'URL.....: ' + status.url + '\n' +
                                'Build #.: ' + status.buildNr; 
                    }
                        
                    this.statusBarItem.text = 'Jenkins' + icon;
                    this.statusBarItem.show();
                    resolve(status != undefined);
                });
        });
    }

    public hideReadOnly() {
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
        }
    }
    
    public getCurrentStatus(): Jenkins.JenkinsStatus {
        return this.currentStatus;
    }
}

export class JenkinsIndicatorController {

    private jenkinsIndicator: JenkinsIndicator;
    private disposable: vscode.Disposable;
    private _isControlled: boolean = false;

    constructor(indicator: JenkinsIndicator) {
        let myself = this;
        this.jenkinsIndicator = indicator;
        this.jenkinsIndicator.updateJenkinsStatus();
    }

    dispose() {
        this.disposable.dispose();
    }

    private onEvent() {
        this.jenkinsIndicator.updateJenkinsStatus();
    }

}