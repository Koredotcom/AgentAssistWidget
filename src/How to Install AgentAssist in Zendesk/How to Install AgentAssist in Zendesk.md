**How to Install AgentAssist for Zendesk** 


The Kore.ai AgentAssist package is available on the Zendesk marketplace. After logging into the Zendesk account, you can install the package from the marketplace.
## **Pre-requisites**
Before you begin the installation, make sure you have the following information:

- Login credentials for your Zendesk account.
- Login credentials for AgentAssist.
- Chatbot details (Client ID, Client Secret, and BotID). 
## **Pre-Installation steps**
Login to the AgentAssist account and find the chatbot details as shown below.
### **Step 1: Login into AgentAssist**
1. Visit <https://agentassist.kore.ai/koreagentassist/>.
1. Enter your email address and click **Continue**.
   ![](Aspose.Words.ab6ce199-3649-49fd-b441-ae3d05a9ef28.001.jpeg)
1. Enter the password and click **Sign In**.

For more details on Bot creation, refer to AgentAssist Documentation: <https://docs.kore.ai/agentassist/onboarding/creating-a-bot/>

### **Step 2: Finding the Chatbot details**
To find chatbot details (Client ID, Client Secret, and BotID):

1. Go to **Configuration** > **Channels** > **Chat**. 

Auto-filled bot details appear. 

1. Copy all the required bot information - Client ID, Client Secret, and BotID.

![](Aspose.Words.ab6ce199-3649-49fd-b441-ae3d05a9ef28.002.jpeg)


## **Installing AgentAssist in Zendesk**
1. Log in to your Zendesk account, find the **Kore.ai AgentAssist for Zendesk** package from the marketplace and click **Install**. The following Installation dialog is displayed.

![](Aspose.Words.ab6ce199-3649-49fd-b441-ae3d05a9ef28.003.jpeg)




1. Enter or select the required information in the dialog:
- **Title:** By default, the title is AgentAssist.
- **AgentAssist URL:** You can find it from your Zendesk environment on the AgentAssist Configuration page. 
- **Token Generation URL:** You can find it from your Zendesk environment.

There should be a REST service available with an implemented method of POST. The method should accept the body, as shown in the image below. Create a JWT token using the ClientID and the Client Secret. 

You can have any service hosted on any cloud platform or the Zendesk environment. 

The token generation URL is marked below: 

![](Aspose.Words.ab6ce199-3649-49fd-b441-ae3d05a9ef28.004.png)

- **Domain:** In the earlier step, the domain name must be copied and pasted from the URL.
- **Client ID, Client Secret, and BotID**: Fill in the previously copied AgentAssist’s chatbot information in these fields. The same information that you copied in the pre-installation step. 

- **Enable Role restrictions?** (optional) Select the Roles that should have access to the AgentAssist package.
- **Enable Group restrictions?** (optional) Select the Groups that should have access to the AgentAssist package.

\3. Click **INSTALL**. 

The AgentAssist widget is now available within Zendesk. Agents can start using the widget in Zendesk. Customer Onboarding includes logging into the Zendesk account, installing the AgentAssist package, initiating chat/voice, customization, and using the AgentAssist widget.

## **Related links:**
- [AgentAssist Widget](https://docs.kore.ai/agentassist/using/agentassist-widget/)
- [AgentAssist Features](https://docs.kore.ai/agentassist/using/agentassist-features/)
