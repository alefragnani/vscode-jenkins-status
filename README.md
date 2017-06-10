# Functionality

View the Jenkins build status of your project inside Visual Studio Code.

![screenshot](images/jenkins-screenshot.png)

# Installation

Press `F1` in VSCode, type `ext install` and then look for `jenkins`.

# Usage

It is automatically enabled if you have a `.jenkins` file in the root folder of your project. The only required information is the `url` pointing to your Jenkins job. 

> _new in version 0.4.0_

If you need _authentication_, just add `username` and `password_or_token` in the `.jenkins` file and you are ready to go.


```json
{
    "url": "http://127.0.0.1:8080/job/myproject",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
}
``` 

## Available commands

* **Jenkins: Open in Jenkins:** Open the Jenkins project in you browser 
* **Jenkins: Open in Jenkins (Console Output):** Open the Console Output of the Jenkins project in you browser 
* **Jenkins: Update Status:** Manually update the status of our Jenkins project

![Commands](images/jenkins-commands.png)

## Available settings

* Interval (in minutes) to automatically update the status
```json
    "jenkins.polling": 2
```
> Note: 0 (zero) means _no update_

# Participate

If you have any idea, feel free to create issues and pull requests

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani

---

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) a :coffee: if you enjoy using this extension :wink: