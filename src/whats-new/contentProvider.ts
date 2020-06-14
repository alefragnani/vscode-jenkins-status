/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor, IssueKind } from "../../vscode-whats-new/src/ContentProvider";

export class WhatsNewJenkinsStatusContentProvider implements ContentProvider {

    public provideHeader(logoUrl: string): Header {
        return <Header> {logo: <Image> {src: logoUrl, height: 50, width: 50}, 
            message: `<b>Jenkins Status</b> adds an area in the status bar, indicating the 
            <b>build status</b> for any <b>Jenkins</b> job. Specially useful if you want to 
            <i>connect</i> a project with its CI server`};
    }

    public provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];
        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "4.0.0", releaseDate: "February 2020" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Adds <b>Multiple Jobs</b> and <b>in-progress</b> status support",
                id: 17,
                kind: IssueKind.PR,
                kudos: "@eramitmittal"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "<b>Status Bar</b> tooltip",
                id: 17,
                kind: IssueKind.PR,
                kudos: "@eramitmittal"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Skip authentication when no `username` is provided",
                id: 35,
                kind: IssueKind.PR,
                kudos: "@leeopop"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "3.1.2", releaseDate: "May 2019" } });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Security Alert: tar",
                id: 49,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "3.1.1", releaseDate: "March 2019" } });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "What's New page broken in VS Code 1.32 due to CSS API changes",
                id: 48,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Updated `.jenkins` example in README",
                id: 31,
                kind: IssueKind.PR,
                kudos: "@kimitaka"
            }
        });

        return changeLog;
    }

    public provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        return sponsors
    }
   
}