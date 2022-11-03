# Agent Assist Zendesk Integration:

As a prerequisite we have to install Zendesk Apps Tools (ZAT) framework from Zendesk.

Please follow the instructions in the below link to install ZAT in your local.

https://developer.zendesk.com/documentation/apps/zendesk-app-tools-zat/installing-and-using-zat/

# Run Locally
```
$ zat server
```
After running the server we have to add  ***?zat=true*** after ticket id in the url see the changes in local environment. 
```
https://{WorkSpaceName}.zendesk.com/agent/tickets/{ticketid}?zat=true
```
# Useful ZAT Commands
## Validate
Runs a suite of validation tests against your app. Because the same tests are run when you upload the app, you probably won't be able to upload the app until your app passes the validate tests.
``` 
$ zat valdiate
```

## package
Creates a zip file that you can upload and install in a Zendesk account.
The command saves the zip file in a folder named tmp.

```
$ zat package
```

## clean
Removes the zip files in the tmp folder that's created when you package the app.

```
$ zat clean
```
For more information please go through the below link.
https://developer.zendesk.com/documentation/apps/zendesk-app-tools-zat/installing-and-using-zat/


## 