<p align="center">
  <br />
  <a title="Learn more about Jenkins Status" href="https://github.com/eramitmittal/vscode-jenkins-status"><img src="https://raw.githubusercontent.com/alefragnani/vscode-jenkins-status/master/images/vscode-jenkins-status-logo-readme.png" alt="Read-only Logo" width="70%" /></a>
</p>

# What's new in Jenkins Status 3

* Adds **Multi-root** Support
* Adds **HTTPS** Support
* Adds **Authentication** Support

# Jenkins Status
It adds an area in the status bar, indicating the build status for any **Jenkins** job. Specially useful if you want to _connect_ a project with its CI server. 

# Jenkins Status (fork)

This is a fork of original project http://github.com/alefragnani/vscode-jenkins-status and will be removed once functionality in this fork gets adopted by the original project

# What's different from original project

* Adds **multiple jenkins job** Support for e.g. if you want to generate the url on the basis of git branch name
* Adds **dynamic generation of jenkins config** Support
* Adds **in-progress** Support
* Adds **monitor for job from all workspace roots**
* **improved status tooltip**

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
[{
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
}]
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

## Available settings

* Interval (in minutes) to automatically update the status
```json
    "jenkins.polling": 2
```
> Note: 0 (zero) means _no update_

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani (Original Author), Amit Mittal (Author of this fork)