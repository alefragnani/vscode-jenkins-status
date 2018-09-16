# Jenkins Status

**Jenkins Status** is an open source extension created for **Visual Studio Code**. While being free and open source, if you find it useful, please consider [supporting it](#support)

It adds an area in the status bar, indicating the build status for any **Jenkins** job. Specially useful if you want to _connect_ a project with its CI server. 

# Features

View the Jenkins build status of your project inside Visual Studio Code.

![screenshot](images/jenkins-screenshot.png)

It is automatically enabled if you have a `.jenkins` file in the root folder of your project. The only required information is the `url` pointing to your Jenkins job. 

If you need _authentication_, just add `username` and `password_or_token` in the `.jenkins` file and you are ready to go.


```json
{
    "url": "http://127.0.0.1:8080/job/myproject",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
}
``` 

If you are having trouble with self-signed certificates and your build status says `SELF_SIGNED_CERT_IN_CHAIN`, you could use a _workaroud_ adding a `strictTls` flag to your `.jenkins` file:

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

## Support

While **Jenkins Status** is free and open source, if you find it useful, please consider supporting it.

I've been working on this on my spare time, and although I enjoy developing it, I would like to be able to give more attention to its growth.

<table align="center" width="60%" border="0">
  <tr>
    <td>
      <a title="Paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"/></a>
    </td>
    <td>
      <a title="Paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=BR&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=BRL&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/pt_BR/i/btn/btn_donate_SM.gif"/></a>
    </td>
    <td>
      <a title="Patreon" href="https://www.patreon.com/alefragnani"><img src="https://raw.githubusercontent.com/alefragnani/oss-resources/master/images/button-become-a-patron-rounded-small.png"/></a>
    </td>
  </tr>
</table>

---

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani