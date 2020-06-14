/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../container";
import { WhatsNewManager } from "../../vscode-whats-new/src/Manager";
import { WhatsNewJenkinsStatusContentProvider } from "./contentProvider";

export function registerWhatsNew() {
    const provider = new WhatsNewJenkinsStatusContentProvider();
    const viewer = new WhatsNewManager(Container.context).registerContentProvider("jenkins-status", provider);
    viewer.showPageInActivation();
    Container.context.subscriptions.push(commands.registerCommand("jenkins.whatsNew", () => viewer.showPage()));
    Container.context.subscriptions.push(commands.registerCommand("jenkins._whatsNewContextMenu", () => viewer.showPage()));
}