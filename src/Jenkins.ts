/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

'use strict'

var request = require('request');

export enum BuildStatus {
  Sucess, Failed, Disabled
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
}

  /**s
   * colorToBuildStatus
   */
export function colorToBuildStatus(color: string): BuildStatus {
    
    switch (color) {
      case "blue" :
        return BuildStatus.Sucess;
      case "blue_anime":
        return BuildStatus.Sucess;
      
      case "red" :
        return BuildStatus.Failed;
      case "red_anime":
        return BuildStatus.Failed;
      
      default:
        return BuildStatus.Disabled;
    }
  }

export function colorToBuildStatusName(color: string): string {
    
    switch (color) {
      case "blue" :
        return 'Sucess';
      case "blue_anime":
        return 'Sucess';
      
      case "red" :
        return 'Failed';
      case "red_anime":
        return 'Failed';
      
      default:
        return 'Disabled';
    }
  }
  
export function getConnectionStatusName(status: ConnectionStatus): string {
  
    switch (status) {
      case ConnectionStatus.Connected:
        return 'Connected';
        
      case ConnectionStatus.InvalidAddress:
        return 'Invalid Address';
    
      case ConnectionStatus.Error:
        return 'Error';
    
      default:
        return 'Authentication Required'
    }
}

export class Jenkins { 


  public getStatus(url: string, username: string, password: string) {

    return new Promise<JenkinsStatus>((resolve, reject) => {

      let data = '';
      let statusCode: number;
      let result: JenkinsStatus;
      
      request
        .get(url + '/api/json', {
          'auth': {
            'user': username,
            'pass': password
          }
        })
        .on('response', function(response) {
          statusCode = response.statusCode;
        })
        .on('data', function(chunk) {
          data += chunk;
        })
        .on('end', function() {
          switch (statusCode) {
            case 200:
                let myArr = JSON.parse(data);
                result = {
                  jobName: myArr.displayName,
                  url: myArr.url,
                  status: colorToBuildStatus(myArr.color),
                  statusName: colorToBuildStatusName(myArr.color),
                  buildNr: myArr.lastBuild.number,
                  connectionStatus: ConnectionStatus.Connected,
                  connectionStatusName: getConnectionStatusName(ConnectionStatus.Connected)
                }
                resolve(result);
              break;
              
            case 401:
            case 403:
              result = {
                jobName: 'AUTHENTICATION NEEDED',
                url: url,
                status: BuildStatus.Disabled,
                statusName: 'Disabled',
                buildNr: statusCode,
                connectionStatus: ConnectionStatus.AuthenticationRequired,
                connectionStatusName: getConnectionStatusName(ConnectionStatus.AuthenticationRequired)
              }
              resolve(result);
              break;
          
            default:
              result = {
                jobName: 'Invalid URL',
                url: url,
                status: BuildStatus.Disabled,
                statusName: 'Disabled',
                buildNr: statusCode,
                connectionStatus: ConnectionStatus.InvalidAddress,
                connectionStatusName: getConnectionStatusName(ConnectionStatus.InvalidAddress)
              }
              resolve(result);
              break;
          }
        })
        .on('error', function(err) {
          result = {
            jobName: err.toString(),
            url: url,
            status: BuildStatus.Disabled,
            statusName: 'Disabled',
            buildNr: err.code,
            connectionStatus: ConnectionStatus.Error,
            connectionStatusName: getConnectionStatusName(ConnectionStatus.Error)
          }
          resolve(result);
        })
    });
  }

}
