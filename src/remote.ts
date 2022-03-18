/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Uri } from "vscode";

export const REMOTE_PREFIX = "vscode-remote";
export const VIRTUAL_WORKSPACE_PREFIX = "vscode-vfs";

export function isRemoteUri(uri: Uri): boolean {
    return uri.scheme === REMOTE_PREFIX || uri.scheme === VIRTUAL_WORKSPACE_PREFIX;
}
