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

# Changelog

## Version 0.1.0

* Initial release

## TODO List

* Support _polling_ for automatic update
* Support authentication

# Participate

If you have any idea, feel free to create issues and pull requests

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani

---

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) if you enjoy using this extension :-)