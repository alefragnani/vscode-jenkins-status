'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
import {exec} from 'child_process';
import * as JenkinsIndicator from './JenkinsIndicator';
var open = require('open');

export function activate(context: vscode.ExtensionContext) {

    let jenkinsIndicator: JenkinsIndicator.JenkinsIndicator; 
    
    let hasJenkinsInRoot: boolean;
    hasJenkinsInRoot = vscode.workspace.rootPath && fs.existsSync(path.join(vscode.workspace.rootPath, '.jenkins'));
    if (hasJenkinsInRoot) {
        jenkinsIndicator = new JenkinsIndicator.JenkinsIndicator();
        let jenkinsController = new JenkinsIndicator.JenkinsIndicatorController(jenkinsIndicator);
        context.subscriptions.push(jenkinsController);
        context.subscriptions.push(jenkinsIndicator);
    }
    
    let dispUpdateStatus = vscode.commands.registerCommand('jenkins.updateStatus', () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
        } else {
            jenkinsIndicator.updateJenkinsStatus();
        }
    });
    context.subscriptions.push(dispUpdateStatus);

    let dispOpenInJenkins = vscode.commands.registerCommand('jenkins.openInJenkins', () => {
        if (!hasJenkinsInRoot) {
            vscode.window.showWarningMessage('The project is not enabled for Jenkins. Missing .jenkins file.');
        } else {
            let settings = JSON.parse(fs.readFileSync(path.join(vscode.workspace.rootPath, '.jenkins')).toString());
            open(settings.url);
        }
    });
    context.subscriptions.push(dispOpenInJenkins);
}