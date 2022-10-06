import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EVENTS } from '../helper/events';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  configObj;
  isCallConversation: boolean = false;
  isAutomationOnGoing: boolean = false;
  isMyBotAutomationOnGoing : boolean = false;
  isParsedPayload;

  constructor(private route: ActivatedRoute, private webSocketService: WebSocketService) {
    console.log("--------------------------cam to common serviceeeeeeeeeeeeeeeeeee");

  }

  getSampleSearchResponse() {
    return of(["agent_assist_agent_response", {
      "isSearch": true, "conversationId": "c-e4eb98b-ddd0-4802-a679-a9d28d13e94b", "botId": "st-c0bff05e-224d-5544-a520-9dcd826afe35", "experience": "voice", "type": "text", "value": "How does COVID -19 spread?", "event": "agent_assist_agent_response", "volleyTone": [], "totalTone": [],
      "suggestions": {
        "dialogs": [{ "name": "Check Balance", "taskRefId": "" }], "faqs": [{ "question": "How does COVID -19 spread?", "taskRefId": "6328015fd044a360eb9d9590", "answer": "Covid spreads through tiny virus particles that get inside the body. The most common way for covid to enter the body is by being breathed in from infected air. This can happen when people stand close together. \r\n\r\nWhen a person breaths out, it’s not just air that leaves their nose or mouth. Tiny water droplets are also breathed out, and these can be infected with viruses like colds or covid. These water droplets can be breathed in by other people, or if they land on a surface that someone touches later, that person could catch coronavirus.\r\n\r\nThis is why wearing masks, social distancing and washing hands is so important. Wearing masks reduces the amount of water droplets that spread when you breath out. Social distancing can help keep you too far away from someone to breath in their air. Washing hands can help kill any viruses on your hands." }, { "question": "How can I get new password?", "taskRefId": "6328015fd044a360eb9d9590", "answer": "Login to application URL and click on forgot password button" }, { "question": "How can I get new password?", "taskRefId": "6328015fd044a360eb9d9590", "answer": "Login to application URL and click on forgot password button" }],
        "searchassist": { "data": [{ "title": "Operations security", "type": "page", "doc_url": "https://searchassist123.atlassian.net/wiki/spaces/SAMPLE/pages/d-824f15a6-a8f3-5472-b77e-2473a10d8139", "content": "IntroductionOperations security focus on the risks brought from the operation (or running through time to obtain a benefit) of the systems and applications. Hence, it is vital to ensure a continual security that keeps along the changes in the internal and external environments in order to ensure that new/evolving risks are taken into consideration in the operation of such systems and applications (for example, detect and patch new vulnerabilities affecting the assets, monitor for possible attacks and abnormal behaviour, perform changes in the assets in a secure way, maintain a secure configuration in the environment, etc). Altough backup of the important data and configurations would be a part of the operations security, it will be treated in the chapter Resilience and disaster recovery for IT systems and applications, as it is also an integral part for the disaster preparation and recovery efforts, as well as some segregation rules that are covered in the chapter Aspects of networking for systems and application security.Tasks to perform1.Document the processes for secure operationOperating procedures shall be documented in an operations manual by the Application/Service Manager. The operations manual should contain the following topics:Detailed architecture overview of all IT systems and applications required for the IT service.Overview of all interfaces.Responsibilities and deputy regulations for administrative tasks.Change management procedures.Configuration management.Vulnerability management.Patch management.Capacity management.Backup and recovery.Logging scheme.Escalation procedures.2.Hardening, vulnerability and patch managementHardening is the process of applying secure configurations to systems and applications in order to minimize the exposure area of that assets to the minimum required.Vulnerability management is the process to discover vulnerabilities in systems and applications (using manual processes like pentesting or by automated tools like vulnerability scanners) and manage them to fix the issues presented.Patching is the process to deploy security updates or fixes from vendors to correct vulnerabilities.The tool that has to be used for automated tracking of remediation of findings in IT assets is VURIOUS. Access to VURIOUS is only required when there are findings which needs remediation – in that case an account is automatically created and you can login. If there are no <span class = \"highlightText\">tickets</span> assigned to you or you have no role in VURIOUS, access is not possible. 2.1 HardeningSecure configuration is critical to avoid exposing too much from an asset (like unnecessary ports or services), having weak security options (like weak passwords) that could be circumvented, and other security concerns (like default accounts and passwords). Hence, IT systems and applications shall be configured securely according to Security Measure Plans which can be found on SFeRA. For applications/systems where such a Security Measure Plan does not exist yet, use the best practices recommended by each vendor (Oracle, Microsoft, Red Hat, SAP, etc) (SISP 12.1.1-05). 2.2 Vulnerability ManagementIT systems and applications connected to the SCM procure Corporate Network shall be scanned by the corporate scan service (called IPINS+) to uncover potential vulnerabilities in software components. Apart from network vulnerability scannings, the service allows to deploy an agent (QAgent) to improve the detection process in systems (from the network scanning some tests are not able to be performed like an agent with a server account could, thus allowing to discard some false positives that network scans would rise, and also the network scan could be prevented from checking all open ports due to FW filtering) (SISP 12-6-1-01). For ACP L2 or L3 assets, IT Security Audits (in case of performing them, only mandatory for ACP L3 assets, althought highly recommended for L2) shall be properly planned and agreed with the respective Asset Manager and Asset Owner of the IT system and application, and incorporated into the System Development Life Cycle of IT systems and applications. At least the following topics shall be carefully planned (SISP 12.7.1-01):2.3 Patch managementA subscription list will be created on the Security Vulnerability Monitoring (SVM) tool containing all the application components and base SW (like OS, DB, application/web server, etc) in order to receive notifications of new vendor security fixes and updates to be implemented on the applicable IT systems and applications (SVM priority wording: \\\"critical\\\" -> Prio 1, \\\"major\\\" -> Prio 2, \\\"minor\\\" -> Prio 3) (SISP 12.6.1-03, SISP PR001-0002, PR001-0011). The patching process will follow these steps:3.Change managementChanges in IT and Application assets can introduce new security issues when not correctly assessed and performed or be the cause for a security issue by themselves (like provoking unavailability). Hence, having a formal process that takes into account security is critical. A formal process to control and perform changes to IT systems and applications shall be defined and established. A formal change management process shall set the obligations to at least (SISP 12.1.2-01, SISP 12.1.2-03):Assess the potential impact of the change prior to implementation.Test the change in testing environments before deployment to production.Define a formal change approval procedure.Define fallback procedures.Document all steps.4.Capacity managementAn incorrect or non-existent management of capacity for systems can turn into availability problems as well as corruption of information (integrity).A capacity management process to ensure the capacity of IT systems and infrastructure shall be documented (Operations manual o document apart linked from the operations manual) and implemented. The capacity management process shall be used to:Set boundaries for acceptable service performance and availability,Monitor the usage of resources and send warning messages to the operations staff when a threshold is reached,Make projection for future resources requirements,Ensure the integrity and availability of IT systems and applications.Aspects like storage capacity, CPU load, network load and others deemed necessary to ensure the proper functioning of the systems should be monitored and alerts established with enough margin (when possible) to be able to solve the issue before it becomes an incident (SISP 12.1.3-01).", "link": "https://searchassist123.atlassian.net/wiki/rest/api/content/393229" }] }
      }, "endOfTask": true, "isPrompt": false, "userInput": "COVID-19"
    }])
  }

  formatSearchResponse(suggestions) {
    let searchResponse: any = {};
    searchResponse.dialogs = [];
    searchResponse.faqs = [];
    searchResponse.articles = [];
    let dialoguesArray = suggestions.dialogs || [];
    let faqArray = suggestions.faqs || [];
    if (suggestions.searchassist && suggestions.searchassist.data) {
      searchResponse.articles = suggestions.searchassist.data;
      for (let article of searchResponse.articles) {
        article.showMoreButton = false;
        article.showLessButton = false;
      }
    }
    for (let faq of faqArray) {
      let faqObject = {
        question: faq.question,
        answer: faq.answer || false,
        showMoreButton: false,
        showLessButton: false
      }
      searchResponse.faqs.push(faqObject);
    }
    for (let dialog of dialoguesArray) {
      searchResponse.dialogs.push({ name: dialog.name, agentRunButton: false });
    }
    return searchResponse;
  }

  prepareAgentAssistRequestParams(data) {
    let agent_assist_request = {
      'conversationId': data.conversationId,
      'query': data.value,
      'botId': data.botId,
      'agentId': '',
      'experience': this.isCallConversation === true ? 'voice' : 'chat',
      'positionId': data.positionId
    }
    if (data.intentName) {
      agent_assist_request['intentName'] = data.value;
    }
    if (data.entities) {
      agent_assist_request['entities'] = data.entities;
    } else {
      agent_assist_request['entities'] = [];
    }
    return agent_assist_request;
  }

  prepareAgentAssistAgentRequestParams(data) {
    let agent_assist_agent_request = {
      'isSearch': data.isSearch,
      'conversationId': data.conversationId,
      'query': data.value,
      'botId': data.botId,
      'intentName': data.intentName,
      'experience': this.isCallConversation === true ? 'voice' : 'chat',
      'positionId': data?.positionId
    }
    return agent_assist_agent_request;
  }


}
