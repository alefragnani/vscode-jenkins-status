/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../container";
import { WhatsNewManager } from "../../vscode-whats-new/src/Manager";
import { JenkinsStatusContentProvider, JenkinsStatusSocialMediaProvider } from "./contentProvider";

export async function registerWhatsNew() {
    const provider = new JenkinsStatusContentProvider();
    const viewer = new WhatsNewManager(Container.context)
        .registerContentProvider("alefragnani", "jenkins-status", provider)
        .registerSocialMediaProvider(new JenkinsStatusSocialMediaProvider())
    await viewer.showPageInActivation();
    Container.context.subscriptions.push(commands.registerCommand("jenkins.whatsNew", () => viewer.showPage()));
    Container.context.subscriptions.push(commands.registerCommand("jenkins._whatsNewContextMenu", () => viewer.showPage()));
}