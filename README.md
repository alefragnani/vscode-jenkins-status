[![](https://img.shields.io/github/actions/workflow/status/alefragnani/vscode-jenkins-status/main.yml?branch=master)](https://img.shields.io/github/actions/workflow/status/alefragnani/vscode-jenkins-status/main.yml?branch=master)

<p align="center">
  <br />
  <a title="Learn more about Jenkins Status" href="https://github.com/eramitmittal/vscode-jenkins-status"><img src="https://raw.githubusercontent.com/alefragnani/vscode-jenkins-status/master/images/vscode-jenkins-status-logo-readme.png" alt="Read-only Logo" width="70%" /></a>
</p>

# What's new in Jenkins Status 4.5

* Adds **Localization** support
* Adds **Workspace Trust** support
* Adds **Virtual Workspace** support
* Adds **Remote Development** support
* Adds **Multi-root** support

## Support

**Jenkins Status** is an open source extension created for **Visual Studio Code**. While being free and open source, if you find it useful, please consider supporting it.

<table align="center" width="60%" border="0">
  <tr>
    <td>
      <a title="Paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"/></a>
    </td>
    <td>
      <a title="GitHub Sponsors" href="https://github.com/sponsors/alefragnani"><img src="https://raw.githubusercontent.com/alefragnani/oss-resources/master/images/button-become-a-sponsor-rounded-small.png"/></a>
    </td>
    <td>
      <a title="Patreon" href="https://www.patreon.com/alefragnani"><img src="https://raw.githubusercontent.com/alefragnani/oss-resources/master/images/button-become-a-patron-rounded-small.png"/></a>
    </td>
  </tr>
</table>

# Jenkins Status

It adds an area in the status bar, indicating the build status for any **Jenkins** job. Specially useful if you want to _connect_ a project with its CI server. 

# Features

View the Jenkins build status of your project inside Visual Studio Code.

![screenshot](images/jenkins-screenshot.png)

It is automatically enabled if you have a `.jenkins` or `.jenkinsrc.js` file in the root folder of your project. The only required information is the `url` pointing to your Jenkins job. 

If you need _authentication_, just add `username` and `password_or_token` in the `.jenkins` file and you are ready to go.

**.jenkins** file

```json
{
    "url": "http://127.0.0.1:8080/job/myproject/",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
}
``` 
or
```json
[
    {
        "url": "http://127.0.0.1:8080/job/myproject/",
        "name": "Jenkins Build",
        "username": "jenkins_user",
        "password": "jenkins_password_or_token"
    },
    {
        "url": "http://127.0.0.1:8080/job/myprojectTests/",
        "name": "Jenkins Acceptance Tests",
        "username": "jenkins_user",
        "password": "jenkins_password_or_token"
    }
]
``` 
**.jenkinsrc.js** file
```js
// can also return a promise of required JSON structure
module.exports = [{
    "url": "http://127.0.0.1:8080/job/myproject/",
    "name": "Jenkins Build",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
},
{
    "url": "http://127.0.0.1:8080/job/myprojectTests/",
    "name": "Jenkins Acceptance Tests",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
}];
```

If you are having trouble with self-signed certificates and your build status says `SELF_SIGNED_CERT_IN_CHAIN`, you could use a _workaroud_ adding a `strictTls` flag to your `.jenkins` file or `.jenkinsrc.js` export:

```json
    "strictTls": false
```

## Available commands

* `Jenkins: Open in Jenkins:` Open the Jenkins project in you browser 
* `Jenkins: Open in Jenkins (Console Output):` Open the Console Output of the Jenkins project in you browser 
* `Jenkins: Update Status:` Manually update the status of our Jenkins project

## Working with Remotes

The extension support [Remote Development](https://code.visualstudio.com/docs/remote/remote-overview) scenarios, and you may choose how to use it, depending on your needs

### I access Remotes, and use `.jenkins` files

This is the _regular_ scenario, and that's why you don't need to do anything special for the extension to work. It works out of the box.

When installed locally, the extension will properly recognize the `.jenkins` file on remotes, and display the status bar for each Url.

_It just works_

### I access Remotes, but I use `.jenkinsrc.js` files

If you need to use `.jenkinsrc.js` files, the extension must be installed on that remote. This happens because it is not possible to _import_ the `.jenkinsrc.js` file remotely.

## Available settings

* Interval (in minutes) to automatically update the status
```json
    "jenkins.polling": 2
```
> Note: 0 (zero) means _no update_

## Contributors

Special thanks to the people that have contributed to the project:

* Kalin Krustev (@md2perpe) - Cleanup source ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/97))
* Kalin Krustev (@md2perpe) - Typo ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/89))
* Kalin Krustev (@kalinkrustev) - Support Remote Development ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/76))
* Keunhong Lee (@leeopop) - Skip authentication when no `username` is provided ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/35))
* Amit Mittal (@eramitmittal) - Multiple Jobs and in-progress status support ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/17))
* Kimitaka Watanabe (@kimitaka) - Updated `.jenkins` example in README  ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/31))
* Zhao Xiaojie (@LinuxSuRen) - Status Bar improvements ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/29))
* Grzegorz Judas (@grzegorzjudas) - HTTPS Support using `NODE_TLS_REJECT_UNAUTHORIZED` environment variable ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/23))
* Adam Parkin (@pzelnip) - Fix tooltip for failed builds ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/15))
* Mike Patrick (@mikepatrick) and Mensa Ulysse (@umens) - Support Authentication ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/10))
* Vojtěch Habarta (@vojtechhabarta) - Support for larger JSON responses ([see PR](https://github.com/alefragnani/vscode-jenkins-status/pull/7))

Also thanks to everyone who helped opening issues with ideas and bug reports.

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani