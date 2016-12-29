# Functionality

View the Jenkins build status of your project inside Visual Studio Code.

![screenshot](images/jenkins-screenshot.png)

# Installation

Press `F1` in VSCode, type `ext install` and then look for `jenkins`.

# Usage

It is automatically enabled if you have a `.jenkins` file in the root folder of your project.

```json
{
    "url": "http://127.0.0.1:8080/job/myproject"
}
``` 

## Available commands

* **Jenkins: Update Status** Manually update the status of our Jenkins project
* **Jenkins: Open in Jenkins** Open the Jenkins project in you browser 

![Commands](images/jenkins-commands.png)

## Available settings

* Interval (in minutes) to automatically update the status
```json
    "jenkins.polling": 2
```
> Note: 0 (zero) means _no update_

# Changelog

## Version 0.2.0

* **New:** Polling for automatic status update (issue [#1](https://github.com/alefragnani/vscode-jenkins-status/issues/1))

## Version 0.1.2

* **Fix:** Support for larger JSON responses (PR [#7](https://github.com/alefragnani/vscode-jenkins-status/pull/7) - kudos to @vojtechhabarta)

## Version 0.1.1

* **Fix:** No StatusBar added when some connection error occurs (issue [#5](https://github.com/alefragnani/vscode-jenkins-status/issues/5))
* **Fix:** Error running commands for non Jenkins project (issue [#6](https://github.com/alefragnani/vscode-jenkins-status/issues/6))

## Version 0.1.0

* Initial release

# Participate

If you have any idea, feel free to create issues and pull requests

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani

---

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) a :coffee: if you enjoy using this extension :wink: