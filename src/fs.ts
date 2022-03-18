/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import path = require("path");
import { Uri, workspace } from "vscode";

export function appendPath(uri: Uri, pathSuffix: string): Uri {
    const pathPrefix = uri.path.endsWith("/") ? uri.path : `${uri.path}/`;
    const filePath = `${pathPrefix}${pathSuffix}`;

    return uri.with({
        path: filePath
    });
}

export function uriJoin(uri: Uri, ...paths: string[]): string {
    return path.join(uri.fsPath, ...paths);
}

export async function uriExists(uri: Uri): Promise<boolean> {
    
    try {
        await workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
}

export async function readFile(filePath: string): Promise<string> {
    const bytes = await workspace.fs.readFile(Uri.parse(filePath));
    return JSON.parse(Buffer.from(bytes).toString('utf8'));
}

export async function readFileUri(uri: Uri): Promise<string> {
    const bytes = await workspace.fs.readFile(uri);
    return JSON.parse(Buffer.from(bytes).toString('utf8'));
}