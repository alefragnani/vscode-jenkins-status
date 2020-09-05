/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export interface Setting {
  url: string;
  username?: string;
  password?: string;
  name?: string;
  strictTls?: number;
}