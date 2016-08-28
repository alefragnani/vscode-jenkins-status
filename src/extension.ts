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

    let jenkinsIndicator = new JenkinsIndicator.JenkinsIndicator();
    let jenkinsController = new JenkinsIndicator.JenkinsIndicatorController(jenkinsIndicator);
    context.subscriptions.push(jenkinsController);
    context.subscriptions.push(jenkinsIndicator);

    let dispUpdateStatus = vscode.commands.registerCommand('jenkins.updateStatus', () => {
        jenkinsIndicator.updateJenkinsStatus();
    });
    context.subscriptions.push(dispUpdateStatus);

    let dispOpenInJenkins = vscode.commands.registerCommand('jenkins.openInJenkins', () => {
        let settings = JSON.parse(fs.readFileSync(path.join(vscode.workspace.rootPath, '.jenkins')).toString());
        open(settings.url);
    });
    context.subscriptions.push(dispOpenInJenkins);
}