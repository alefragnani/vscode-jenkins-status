/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import request = require("request");
import * as vscode from "vscode";

export enum BuildStatus {
  Success, Failed, Disabled, InProgress
}

export enum ConnectionStatus {
  Connected, InvalidAddress, AuthenticationRequired, Error
}

export interface JenkinsStatus {
  jobName: string;
  url: string;
  buildNr: number;
  status: BuildStatus;
  statusName: string;
  connectionStatus: ConnectionStatus;
  connectionStatusName: string;
  code: number;
}

class RequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
    this.status = (status || 500);
  }
}
class RequestAuthorizationError extends RequestError { }
class RequestInvalid extends RequestError { }

/**s
 * colorToBuildStatus
 */
export function colorToBuildStatus(color: string): BuildStatus {

  if (color.endsWith('_anime')) { return BuildStatus.InProgress; }

  switch (color) {
    case "blue":
      return BuildStatus.Success;

    case "red":
      return BuildStatus.Failed;



    default:
      return BuildStatus.Disabled;
  }
}

export function colorToBuildStatusName(color: string): string {

  switch (color) {
    case "blue":
      return 'Sucess';
    case "blue_anime":
      return 'Sucess';

    case "red":
      return 'Failed';
    case "red_anime":
      return 'Failed';


    case "yellow":
      return "Unstable";
    case "yellow_anime":
      return "Unstable";

    case "grey":
      return "Pending";
    case "grey_anime":
      return "Pending";

    case "aborted":
      return "Aborted";
    case "aborted_anime":
      return "Aborted";

    case "notbuilt":
      return "Not built";
    case "notbuilt_anime":
      return "Not built";

    default:
      return 'Disabled';
  }
}

export function getConnectionStatusName(status: ConnectionStatus): string {

  switch (status) {
    case ConnectionStatus.Connected:
      return "Connected";

    case ConnectionStatus.InvalidAddress:
      return "Invalid Address";

    case ConnectionStatus.Error:
      return "Error";

    default:
      return "Authentication Required"
  }
}

export class Jenkins {
  private gitApi;
  private gitRepo;

  private getCurrentBranch(): string {
    try {
      if (!this.gitApi) {
        const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
        this.gitApi = gitExtension.getAPI(1);
      }

      this.gitRepo = this.gitApi.repositories[0];
      return encodeURIComponent(this.gitRepo.state.HEAD.name)
    } catch (error) {
      console.error(error)
      return "unable to get branch"
    }
  }

  public async getStatus(url: string, username: string, password: string): Promise<JenkinsStatus> {
    let result: JenkinsStatus;
    try {
      // Get data from URL provided in settings
      let data = await this.apiRequest(url, username, password);

      if (data._class === "org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject") {
        const branch = this.getCurrentBranch()
        data = await this.apiRequest(vscode.Uri.joinPath(vscode.Uri.parse(url), "/job", branch).toString(), username, password);
      }

      result = {
        jobName: data.displayName,
        url: data.url,
        status: colorToBuildStatus(data.color),
        statusName: colorToBuildStatusName(data.color),
        buildNr: data.lastBuild ? data.lastBuild.number : 0,
        connectionStatus: ConnectionStatus.Connected,
        connectionStatusName: getConnectionStatusName(ConnectionStatus.Connected),
        code: undefined
      }

      if (result.status === BuildStatus.InProgress) {
        result.statusName = result.statusName + " (in progress)";
      }

      return result;
    } catch (error) {
      if (error instanceof RequestAuthorizationError) {
        return {
          jobName: "AUTHENTICATION NEEDED",
          url,
          status: BuildStatus.Disabled,
          statusName: "Disabled",
          buildNr: undefined,
          code: error.status,
          connectionStatus: ConnectionStatus.AuthenticationRequired,
          connectionStatusName: getConnectionStatusName(ConnectionStatus.AuthenticationRequired)
        }
      } else if (error instanceof RequestInvalid) {
        return {
          jobName: "Invalid URL",
          url,
          status: BuildStatus.Disabled,
          statusName: "Disabled",
          buildNr: undefined,
          code: error.status,
          connectionStatus: ConnectionStatus.InvalidAddress,
          connectionStatusName: getConnectionStatusName(ConnectionStatus.InvalidAddress)
        }
      }

      return {
        jobName: error.toString(),
        url,
        status: BuildStatus.Disabled,
        statusName: "Disabled",
        buildNr: undefined,
        code: error.code,
        connectionStatus: ConnectionStatus.Error,
        connectionStatusName: getConnectionStatusName(ConnectionStatus.Error)
      }
    }
  }

  public async apiRequest(url: string, username: string, password: string): Promise<any> {
    let data = "";
    let statusCode: number;
    let authInfo: any;

    if (username) {
      authInfo = {
        auth: {
          user: username,
          pass: password
        }
      };
    } else {
      authInfo = {};
    }

    return new Promise<any>((resolve, reject) => {
      request.get(url + "/api/json", authInfo)
        .on("response", function (response) {
          statusCode = response.statusCode;
        })
        .on("data", function (chunk) {
          data += chunk;
        })
        .on("end", function () {
          switch (statusCode) {
            case 200: {
              resolve(JSON.parse(data));
              break
            }
            case 401:
            case 403: {
              reject(new RequestAuthorizationError("AUTHORIZATION_REQUIRED", statusCode))
              break
            }
            default: {
              reject(new RequestInvalid("AUTHORIZATION_REQUIRED", statusCode))
              break
            }
          }
        })
        .on("error", function (err) {
          reject(err)
        })
    })
  }
}
