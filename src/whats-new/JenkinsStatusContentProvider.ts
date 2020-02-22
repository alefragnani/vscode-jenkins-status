/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor } from "../../vscode-whats-new/src/ContentProvider";

export class WhatsNewJenkinsStatusContentProvider implements ContentProvider {

    public provideHeader(logoUrl: string): Header {
        return <Header> {logo: <Image> {src: logoUrl, height: 50, width: 50}, 
            message: `<b>Jenkins Status</b> adds an area in the status bar, indicating the 
            <b>build status</b> for any <b>Jenkins</b> job. Specially useful if you want to 
            <i>connect</i> a project with its CI server`};
    }

    public provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];
        changeLog.push({kind: ChangeLogKind.NEW, message: "Adds <b>Multi-root</b> support"});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Adds <b>Multiple Jobs</b> support 
            (Thanks to @eramitmittals - <a title=\"Open PR #17\" 
            href=\"https://github.com/alefragnani/vscode-jenkins-status/pull/17\">
            PR #17</a>)</b>`});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Adds <b>in-progress</b> status support 
            (Thanks to @eramitmittals - <a title=\"Open PR #17\" 
            href=\"https://github.com/alefragnani/vscode-jenkins-status/pull/17\">
            PR #17</a>)</b>`});
        changeLog.push({kind: ChangeLogKind.NEW, message: "<b>Auto-detect</b> changes in `.jenkins` file"});
        changeLog.push({kind: ChangeLogKind.NEW, message: `<b>Status Bar</b> improvement 
            (Thanks to @LinuxSuRen - <a title=\"Open PR #29\" 
            href=\"https://github.com/alefragnani/vscode-jenkins-status/pull/29\">
            PR #29</a>)`});
        changeLog.push({kind: ChangeLogKind.NEW, message: "Adds <b>HTTPS</b> servers support"});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Adds <b>Authentication</b> support 
            (Thanks to @mikepatrick and @umens - <a title=\"Open PR #10\" 
            href=\"https://github.com/alefragnani/vscode-jenkins-status/pull/10\">
            PR #10</a>)</b>`});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Tooltip for failed builds (Thanks to @pzelnip 
            - <a title=\"Open PR #15\" href=\"https://github.com/alefragnani/vscode-jenkins-status/pull/15\">
            PR #15</a>)</b>`});
        return changeLog;
    }

    public provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        return sponsors
    }
   
}