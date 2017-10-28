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
    
    let hasJenkinsInRoot: boolean;
    hasJenkinsInRoot = hasJenkinsInAnyRoot();
    if (hasJenkinsInRoot) {
        jenkinsIndicator = new JenkinsIndicator.JenkinsIndicator();
        let jenkinsController = new JenkinsIndicator.JenkinsIndicatorController(jenkinsIndicator);
        context.subscriptions.push(jenkinsController);
        context.subscriptions.push(jenkinsIndicator);
    }
    
    let dispUpdateStatus = vscode.commands.registerCommand('jenkins.updateStatus', () => updateStatus());
    context.subscriptions.push(dispUpdateStatus);

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => updateStatus()));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorViewColumn(e => updateStatus()));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(e => updateStatus()));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(e => updateStatus()));    

    let dispOpenInJenkins = vscode.commands.registerCommand('jenkins.openInJenkins', () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
        } else {
            let settings = JSON.parse(fs.readFileSync(path.join(vscode.workspace.rootPath, '.jenkins')).toString());
            open(settings.url);
        }
    });
    context.subscriptions.push(dispOpenInJenkins);


    let dispOpenInJenkinsConsoleOutput = vscode.commands.registerCommand('jenkins.openInJenkinsConsoleOutput', () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
        } else {
            let settings = JSON.parse(fs.readFileSync(path.join(vscode.workspace.rootPath, '.jenkins')).toString());
            
            let status: JenkinsStatus;
            status = jenkinsIndicator.getCurrentStatus();   
            if (status.status != BuildStatus.Disabled) {
                open(settings.url + status.buildNr.toString() + '/console');
            } else {
                vscode.window.showWarningMessage('The Jenkins job has some connnection issues. Please check the status bar for more information.');
            }         
        }
    });
    context.subscriptions.push(dispOpenInJenkinsConsoleOutput);
    
    
    
    
    function updateStatus() {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
            return;
        } 
        
        if (jenkinsIndicator.getCurrentBasePath() !== getCurrentBasePath()) {
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
    }

    function getCurrentBasePath(): string {
        if (!vscode.workspace.workspaceFolders) {
            return undefined;
        }

        return vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri.fsPath;
    }

}