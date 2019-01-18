/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

"use strict";

import {exec} from "child_process";
import fs = require("fs");
import opn = require("opn");
import path = require("path");
import * as vscode from "vscode";
import { WhatsNewManager } from "../vscode-whats-new/src/Manager";
import { BuildStatus, JenkinsStatus } from "./Jenkins";
import * as JenkinsIndicator from "./JenkinsIndicator";
import { WhatsNewJenkinsStatusContentProvider } from "./whats-new/JenkinsStatusContentProvider";

export function activate(context: vscode.ExtensionContext) {

    let jenkinsIndicator: JenkinsIndicator.JenkinsIndicator;
    let jenkinsController: JenkinsIndicator.JenkinsIndicatorController; 
    let hasJenkinsInRoot: boolean;    
    
    hasJenkinsInRoot = hasJenkinsInAnyRoot();
    if (hasJenkinsInRoot) {
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

        if (!jenkinsIndicator.getCurrentBasePath() || !fs.existsSync(path.join(jenkinsIndicator.getCurrentBasePath(), ".jenkins"))) {
            vscode.window.showWarningMessage("The current project is not enabled for Jenkins.");
            return;            
        }
        
        const settings = JSON.parse(fs.readFileSync(path.join(jenkinsIndicator.getCurrentBasePath(), ".jenkins")).toString());
        opn(settings.url);
    });
    context.subscriptions.push(dispOpenInJenkins);

    const dispOpenInJenkinsConsoleOutput = vscode.commands.registerCommand("jenkins.openInJenkinsConsoleOutput", () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage("The project is not enabled for Jenkins. Missing .jenkins file.");
            return;
        } 

        if (!jenkinsIndicator.getCurrentBasePath() || !fs.existsSync(path.join(jenkinsIndicator.getCurrentBasePath(), ".jenkins"))) {
            vscode.window.showWarningMessage("The current project is not enabled for Jenkins.");
            return;            
        }

        const settings = JSON.parse(fs.readFileSync(path.join(jenkinsIndicator.getCurrentBasePath(), ".jenkins")).toString());
        
        let status: JenkinsStatus;
        status = jenkinsIndicator.getCurrentStatus();   
        if (status.status !== BuildStatus.Disabled) {
            opn(settings.url + status.buildNr.toString() + "/console");
        } else {
            vscode.window.showWarningMessage("The Jenkins job has some connnection issues. Please check the status bar for more information.");
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
        
        if (showMessage ||
          (!jenkinsIndicator.getCurrentBasePath() || (jenkinsIndicator.getCurrentBasePath() !== getCurrentBasePath()))) {
            jenkinsIndicator.updateJenkinsStatus(getCurrentBasePath());
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
            hasAny = fs.existsSync(path.join(element.uri.fsPath, ".jenkins"));
            if (hasAny) {
                return hasAny;
            }
        }

        return hasAny;
    }

    function getCurrentBasePath(): string {
        if (!vscode.workspace.workspaceFolders) {
            return undefined;
        }

        if (!vscode.window.activeTextEditor) {
            if (vscode.workspace.workspaceFolders.length === 1) {
                return vscode.workspace.workspaceFolders[0].uri.fsPath;
            } else {
                return undefined;
            }
        }

        return vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri.fsPath;
    }

}