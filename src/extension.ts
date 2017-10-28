'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
import {exec} from 'child_process';
import * as JenkinsIndicator from './JenkinsIndicator';
import { BuildStatus, JenkinsStatus } from './Jenkins';
var open = require('open');

export function activate(context: vscode.ExtensionContext) {

    let jenkinsIndicator: JenkinsIndicator.JenkinsIndicator;
    let jenkinsController: JenkinsIndicator.JenkinsIndicatorController; 
    let hasJenkinsInRoot: boolean;
    
    hasJenkinsInRoot = hasJenkinsInAnyRoot();
    if (hasJenkinsInRoot) {
        createJenkinsIndicator(context);
        updateStatus();
    }
    
    let dispUpdateStatus = vscode.commands.registerCommand('jenkins.updateStatus', () => updateStatus(true));
    context.subscriptions.push(dispUpdateStatus);

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => updateStatus()));
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(e => {
        hasJenkinsInRoot = hasJenkinsInAnyRoot();
        if (hasJenkinsInRoot) {
            createJenkinsIndicator(context);
        }
        updateStatus()}
    ));

    let dispOpenInJenkins = vscode.commands.registerCommand('jenkins.openInJenkins', () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
            return;
        } 

        if (!jenkinsIndicator.getCurrentBasePath() || !fs.existsSync(path.join(jenkinsIndicator.getCurrentBasePath(), '.jenkins'))) {
            vscode.window.showWarningMessage('The current project is not enabled for Jenkins.');
            return;            
        }
        
        let settings = JSON.parse(fs.readFileSync(path.join(jenkinsIndicator.getCurrentBasePath(), '.jenkins')).toString());
        open(settings.url);
    });
    context.subscriptions.push(dispOpenInJenkins);


    let dispOpenInJenkinsConsoleOutput = vscode.commands.registerCommand('jenkins.openInJenkinsConsoleOutput', () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
            return;
        } 

        if (!jenkinsIndicator.getCurrentBasePath() || !fs.existsSync(path.join(jenkinsIndicator.getCurrentBasePath(), '.jenkins'))) {
            vscode.window.showWarningMessage('The current project is not enabled for Jenkins.');
            return;            
        }

        let settings = JSON.parse(fs.readFileSync(path.join(jenkinsIndicator.getCurrentBasePath(), '.jenkins')).toString());
        
        let status: JenkinsStatus;
        status = jenkinsIndicator.getCurrentStatus();   
        if (status.status != BuildStatus.Disabled) {
            open(settings.url + status.buildNr.toString() + '/console');
        } else {
            vscode.window.showWarningMessage('The Jenkins job has some connnection issues. Please check the status bar for more information.');
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
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
            return;
        } 
        
        if (!jenkinsIndicator.getCurrentBasePath() || (jenkinsIndicator.getCurrentBasePath() !== getCurrentBasePath())) {
            jenkinsIndicator.updateJenkinsStatus(getCurrentBasePath());
        }
    };
    
    let interval;
    let polling: number = vscode.workspace.getConfiguration('jenkins').get('polling', 0);
    if (polling > 0) {
        setInterval(updateStatus, polling * 60000);
    }

    function hasJenkinsInAnyRoot(): boolean {

        if (!vscode.workspace.workspaceFolders) {
            return false;
        }

        let hasAny: boolean = false;

        for (let index = 0; index < vscode.workspace.workspaceFolders.length; index++) {
            let element: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[index];
            hasAny = fs.existsSync(path.join(element.uri.fsPath, '.jenkins'));
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

        return vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri.fsPath;
    }

}