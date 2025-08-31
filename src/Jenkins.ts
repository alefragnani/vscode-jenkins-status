/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import axios, { AxiosResponse, AxiosError } from "axios";
import { l10n } from "vscode";

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

  /**s
   * colorToBuildStatus
   */
export function colorToBuildStatus(color: string): BuildStatus {
  
    if(color.endsWith('_anime')) { return BuildStatus.InProgress; }

    switch (color) {
      case "blue" :
        return BuildStatus.Success;
     
      case "red" :
        return BuildStatus.Failed;
      
      

      default:
        return BuildStatus.Disabled;
    }
  }

export function colorToBuildStatusName(color: string): string {
    
  switch (color) {	  
    case "blue" :	      
      return l10n.t("Success");	
    case "blue_anime":	
      return l10n.t("Success");	
            
    case "red" :	      
      return l10n.t("Failed");	
    case "red_anime":	  
      return l10n.t("Failed");	


    case "yellow":
      return l10n.t("Unstable");
    case "yellow_anime":
      return l10n.t("Unstable");

    case "grey":
      return l10n.t("Pending");
    case "grey_anime":
      return l10n.t("Pending");

    case "aborted":
      return l10n.t("Aborted");
    case "aborted_anime":
      return l10n.t("Aborted");

    case "notbuilt":
      return l10n.t("Not built");
    case "notbuilt_anime":
      return l10n.t("Not built");

    default:
      return l10n.t("Disabled");
  }
}
  
export function getConnectionStatusName(status: ConnectionStatus): string {
  
    switch (status) {
      case ConnectionStatus.Connected:
        return l10n.t("Connected");
        
      case ConnectionStatus.InvalidAddress:
        return l10n.t("Invalid Address");
    
      case ConnectionStatus.Error:
        return l10n.t("Error");
    
      default:
        return l10n.t("Authentication Required")
    }
}

export class Jenkins { 

  public getStatus(url: string, username: string, password: string) {

    return new Promise<JenkinsStatus>((resolve) => {

      let result: JenkinsStatus;

      // Configure axios request options
      const config: any = {
        method: 'get',
        url: url + "/api/json",
        validateStatus: () => {
          // Don't throw on any status code, we'll handle them manually
          return true;
        }
      };

      // Add authentication if username is provided
      if (username) {
        config.auth = {
          username: username,
          password: password
        };
      }
      
      axios(config)
        .then((response: AxiosResponse) => {
          const statusCode = response.status;
          
          switch (statusCode) {
            case 200: {
              const myArr = response.data;
              result = {
                jobName: myArr.displayName,
                url: myArr.url,
                status: colorToBuildStatus(myArr.color),
                statusName: colorToBuildStatusName(myArr.color),
                buildNr: myArr.lastBuild ? myArr.lastBuild.number : 0,
                connectionStatus: ConnectionStatus.Connected,
                connectionStatusName: getConnectionStatusName(ConnectionStatus.Connected),
                code: undefined
              }
              
              if(result.status === BuildStatus.InProgress) {
                result.statusName = l10n.t("{0} (in progress)", result.statusName);
              }
              resolve(result);
              break;
            }
              
            case 401:
            case 403:
              result = {
                jobName: "AUTHENTICATION NEEDED",
                url,
                status: BuildStatus.Disabled,
                statusName: l10n.t("Disabled"),
                buildNr: undefined,
                code: statusCode,
                connectionStatus: ConnectionStatus.AuthenticationRequired,
                connectionStatusName: getConnectionStatusName(ConnectionStatus.AuthenticationRequired)
              }
              resolve(result);
              break;
          
            default:
              result = {
                jobName: "Invalid URL",
                url,
                status: BuildStatus.Disabled,
                statusName: l10n.t("Disabled"),
                buildNr: undefined,
                code: statusCode,
                connectionStatus: ConnectionStatus.InvalidAddress,
                connectionStatusName: getConnectionStatusName(ConnectionStatus.InvalidAddress)
              }
              resolve(result);
              break;
          }
        })
        .catch((error: AxiosError | Error) => {
          let errorCode: any;
          let errorMessage: string;
          
          if (axios.isAxiosError(error)) {
            errorCode = error.code;
            errorMessage = error.message;
          } else {
            errorCode = undefined;
            errorMessage = error.toString();
          }
          
          result = {
            jobName: errorMessage,
            url,
            status: BuildStatus.Disabled,
            statusName: l10n.t("Disabled"),
            buildNr: undefined,
            code: errorCode,
            connectionStatus: ConnectionStatus.Error,
            connectionStatusName: getConnectionStatusName(ConnectionStatus.Error)
          }
          resolve(result);
        });
    });
  }

}
