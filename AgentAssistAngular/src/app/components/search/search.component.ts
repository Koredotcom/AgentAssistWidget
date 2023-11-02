import { Component, OnInit } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{

  subs = new SubSink();
  searchText : string = '';
  searchedResultData: any = {};

  searchResponse: any = {};
  answerPlaceableIDs : any = [];

  faqViewCount: number;
  articleViewCount: number;
  snippetViewCount: number;
  faqAllView: boolean = false;
  articleAllView: boolean = false;
  snippetAllView: boolean = false;

  searchResultText: string;


  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private websocketService : WebSocketService, private handleSubjectService : HandleSubjectService){

  }
  
  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.websocketService.agentAssistAgentResponse$.subscribe((agentResponse: any) => {
      if(agentResponse){
        if(agentResponse.suggestions){
          agentResponse.suggestions.searchassist = {
            "servicenow": [
                {
                    "content": "MFA Defender - Master Article What is MFA Defender? MFA, meaning <span class=\"highlightText\">Multi</span>-Factor Authentication, expands upon traditional username&#x2F;password by adding a trusted external device (e.g.: smartphone, token), which makes it harder for the attackers to reach their goal of negatively impacting credentials. <span class=\"highlightText\">Multi</span>-factor Authentication (MFA) is an authentication method that requires the user to provide two or more verification factors to gain access to a resource such as an application, online account, or a VPN. MFA is a core component of a strong identity and access management (IAM) policy. Users will have two types of token: Soft Token (application) or Hardware Token (Yubikey). Defender Soft Token -App on a mobile device, either corporate or personal that can be installed free of charge from Apple Store or Google Play Store. -All HYG employees with a corporate phone should use it. Any other HYG employee that chooses to use their personal phone can set it up as well. YubiKey Hard Token -A hardware token (YubiKey) is a dedicated physical device that you plug into your workstation or laptop that is used to authenticate your account. -If the user is unable&#x2F;doesn&#x27;t want to use their personal phone, they may request an HYG physical hardware token. YubiKey 5 Series Multi-protocol security key, eliminate account takeovers with strong two-factor, multi-factor and passwordless authentication, and seamless touch-to-sign. Multi-protocol support allows for strong security for legacy and modern environments. And a full range of form factors allows users to secure online accounts on all of the devices that they love, across desktops and mobile. How to Register Defender Soft Token 1. Install Defender Soft Token App For Android devices open the Google Play StoreFor Apple devices open App StoreSearch for Defender Soft Token 2. To register the token: Connect to a HYG network or VPNOn your computer open an internet browser (Chrome, Firefox or Edge)In the Address bar input https:&#x2F;&#x2F;mfadefender&#x2F;requestLogin with your UserID, Password &amp;amp; for the Domain input Global Click Sign InSelect the Phone Operating System (Android or iOS) Click NextA QR Code will be displayed along with the Activation Code. On the mobile device in the Defender App it should display “No Tokens added. Tap to add a new token” Tap in the App and it will display [Scan QR Code].Click [Scan QR Code] The device may request permission to use the Camera and display a message “Allow Defender Soft Token to take pictures” – Click AllowScan the QR Code display on the computer - This will populate the Activation CodeAt the top it will show [Enter Token Name] – Click in the field and input: HYG TokenClick [Activate]The Software Token will now show a One Time Passcode (OTP) On the computer, click on &amp;#34;Finish&amp;#34; All done! How to register YubiKey Hard Token On your computer open a web browser (Chrome, Firefox or Edge) and Logon with you domain credentials at the Defender Portal: https:&#x2F;&#x2F;mfadefender&#x2F;On the screen click &amp;#34;Register a Hardware Token&amp;#34; 3. System will ask to input the Token Serial Number (may be found at the top of the key) 4. Click next, and will ask you to input a One Time Passcode 5. Insert the YubiKey into the computer 6. Hover the mouse over &amp;#34;Input Passcode Box&amp;#34; 7. Press and release the button on the YubiKey to input the 6-digit code (NOTE: For NO longer than 1-2 seconds) 8. Click &amp;#34;Finish&amp;#34;, and you&#x27;re done! MFA Windows Defender - Product overview https:&#x2F;&#x2F;www.oneidentity.com&#x2F;products&#x2F;defender&#x2F; Defender, enhances security by requiring two-factor authentication to gain access to your network resources. Defender uses your current identity store within Microsoft Active Directory (AD) to enable two-factor authentication. When the Defender Desktop Login is installed the user of the computer will be prompted to input their Password &amp;amp; a Passcode from either their Defender Software token or a Hardware Token. The first login after MFA is enabled, a connection to HYG corporate network is needed (either from an HYG office or through a VPN Connection) IMPORTANT NOTE: If a HYG connection is not available at this login, following error message will be displayed: &amp;#34;Defender cannot log you on now because the defender security server is not available and you have no cached token data&amp;#34; -User won&#x27;t require internet connection to the external device (e.g.: smartphone, tablet, etc.) once initial set up is completed -Insert YubiKey only when asked for a passcode, press the key for 1-2 seconds while your mouse is active on the &amp;#34;passcode&amp;#34; field. Pressing it for too long might cause the authentication to fail -Defender Authentication notification coming up means the token information has been downloaded to the system successfully and next logon won&#x27;t need a HYG connection first MFA Cisco VPN *Note: User does not need to connect to VPN every time from the Windows login. They only need to do it at least once every 30 days to refresh the local cache. Or if their Defender app or Yubikey has been recently enrolled. - If recently enrolled or reset, please connect to the VPN by clicking on the &amp;#34;Network Sign-In&amp;#34; icon -Then an additional field called &amp;#34;Passcode&amp;#34; will appear -6-digit passcode from either Defender Soft Token App or Yubikey Hard Token will need to be entered MFA Troubleshooting 1. Log into the HYG JS 2. Check if user has a token assigned on Active Directory (AD) &amp;gt; Defender Tab 3. Reset Violation Count -If the &amp;#34;Violation Count&amp;#34; has any other number than &amp;#34;0&amp;#34;, the user has been locked out from defender -Click on &amp;#34;Reset&amp;#34; -If counter increases again, escalate the ticket to &amp;#34;HYG-MFA Defender Support&amp;#34; 4. Test Passcode -Select the token from AD -Click on &amp;#34;Test&amp;#34; -Ask the user for the code displayed on their app -Type the code in the &amp;#34;Response&amp;#34; field NOTE: Even if the result is successful or not, go ahead and reset the token if the user continues to have issues. 5. Reset Token -Select the Token -Click on &amp;#34;Helpdesk&amp;#34; and then on &amp;#34;Reset&amp;#34; 6. Temporary 6-digit code -Active Directory (AD) &amp;gt; Defender Tab &amp;gt; HelpDesk -Change expiration date to &amp;#34;1 week&amp;#34; -Select the option &amp;#34;Allow response to be used multiple times&amp;#34; -Click &amp;#34;Assign&amp;#34;, this will generate a code to allow the user to login *NOTE: If user does not have any token, please follow these steps to create a generic Windows token so that you can assign a temporary passcode. - Click on Program - You will have to click on Next and select the Windows option here: - You will have to continue clicking next until you see this screen below: - Click on browse and navigate to the desktop folder, and click on next - Click Finish - The user will now have a token for Windows that you can use to assign a temporary token - Provide a temporary token (keep in mind user will have to wait around 5-10 minutes before being able to access). - Once user is able to access the computer, guide him on how to setup a phone token as instructed above. - Once user has the new token, delete the Windows token by highlighting it and selecting Unassign. Ticket Creation Flowchart Yubikey Hard Token troubleshooting steps -Make sure YubiKey token is properly plugged into the USB Port -Plug the token into a different USB Port -Device is not visibly damaged -User has selected the &amp;#34;Passcode&amp;#34; field and the cursor is active -Do not press for more than 2 seconds -Test the passcode is being generated Ticket Escalation If a Defender user issue cannot be resolved by the Service Desk or Field Service it should be sent to the HYG-MFA Defender Support queue. If the user is unable to logon ensure the Impact is 3 – Moderate – Limited and Urgency is 2 - High When escalating, include the following details: -What is the issue?-Is the user in the office or remote?-If user is remote, was the user able to connect to VPN? -What type of token does the user have? (Defender Soft Token App &#x2F; YubiKey Token)-Does the user have a violation count greater than 0 in Defender?-Did Service Desk try to generate a temporary passcode for the user?-Is the temporary passcode generated working? -Did Service Desk try to re-register the token? What was the result?-When did the issue start?-Please list all troubleshooting steps done",
                    "contentId": "sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_08d0cc3cdbc44954f8861a8c139619b7",
                    "serviceNow_topic": "How-To/FAQ",
                    "type": "text",
                    "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fnttdsuat.service-now.com%2Fnav_to.do%3Furi%3Dkb_view.do%3Fsys_kb_id%3D08d0cc3cdbc44954f8861a8c139619b7&requestId=fsh-54c518bf-57cd-58df-9552-a70189910ba3&contentId=sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_08d0cc3cdbc44954f8861a8c139619b7&hId=c0bcf0f694310f415e5a4e6db8f740761d9b1324a94ef3e4b904f03bca5739e7",
                    "title": "MFA Defender - Master Article",
                    "serviceNow_sys_class_name": "kb_knowledge"
                }
            ],
            "snippets": [
                {
                    "title": "Here are a few suggestions to get started",
                    "content": [
                        "Explain how your team should use this space by selecting the Edit button and customizing this Overview page",
                        "Select Create to make a new page in your space",
                        "Add links to tools guides and other team resources",
                        "Bookmark our guide to learn how to build Confluence spaces for any team",
                        "Explore the sample pages we've created for you"
                    ],
                    "page_url": "https://madhavkb2.atlassian.net/wiki/spaces/M2/overview#:~:text=Here%20are%20a%20few%20suggestions%20to%20get%20started"
                }
            ]
          }
        }
        this.searchedResultData = agentResponse
        this.handleSearchResponse(agentResponse);
      }
    });
  }

  typeAHead = this.typeAHeadDeBounce((val, connectionDetails)=>this.getAutoSearchApiResult(val, connectionDetails));
  onSearch(event: any) {   
    if(this.searchText.length > 0) {
      this.typeAHead(this.searchText, this.rootService.connectionDetails);
    } else{
      this.searchResponse = {};
      this.handleSubjectService.setSearchResponse(null);
    }
    // else {
    //   this.filterSet = [];
    //   this.typeahead.emit('');
    // }
    
  }

  typeAHeadDeBounce(func, timeout = 300){
      let delay;
      return function(...args){
        clearTimeout(delay);
        delay = setTimeout(()=>{
           func.apply(this, args);
        }, timeout)
      }
    }
  

    getAutoSearchApiResult(value, params){
      const {botId, conversationId} = this.rootService.getConnectionDetails();
      let payload = {
        "query": value,
        "maxNumOfResults": 3,
        "lang": "en"
      }
      this.serviceInvoker.invoke('post.autoSearch', { botId: botId, convId: conversationId }, payload, { autoSearch: 'true', botId : botId }, params.agentassisturl).subscribe((res)=> {
        console.log(res, 'res********from autho search');
        
      })
    }


    emitSearchRequest(value, isSearch) {
      let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
      connectionDetails.value = value;
      connectionDetails.isSearch = isSearch;
      // connectionDetails.positionId = searchObj?.positionId;
      if (connectionDetails.interactiveLanguage && typeof connectionDetails.interactiveLanguage == 'string' && connectionDetails.interactiveLanguage != "''") {
        connectionDetails['language'] = connectionDetails.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }


    getSearchResults(event){
      this.setValue(event.target.value, true)
    }

    setValue(value: any, isEntered  = false) {
      this.searchText = value;
      // this.isCursorOverFilterSet = false;
      // this.hideList();
      if(isEntered){
        this.emitSearchRequest(this.searchText, true)
      }else{
        // this.typeahead.emit(this.searchText);
      }
      
    }

    handleSearchResponse(response) {
      if(response && response.suggestions){
        if (this.answerPlaceableIDs.length == 0) {
          this.searchResponse = {};
          // response.suggestions.faqs = [
          //   {question : "How does COVID -19 spread?", answer : ["Covid spreads through tiny virus particles that get inside the body. The most common way for covid to enter the body is by being breathed in from infected air. This can happen when people stand close togethe When a person breaths out, it’s not just air that leaves their nose or mouth. Tiny water droplets are also breathed out, and these can be infected with viruses like colds or covid. These water droplets can be breathed in by other people, or if they land on a surface that someone touches later, that person could catch coronavirus."]},
          //   {question : "Reset Password" , answer : ['to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click off', 'to change password on reset reset to reset password click on reset to reset password click on reset to reset password click on reset to reset password click on reset', 'to reset password click on reset', 'to change password click on reset']}
          // ]
          this.searchResponse = this.rootService.formatSearchResponse(response);
          this.searchResponse.totalSearchResults =  (this.searchResponse.dialogs?.length + this.searchResponse.faqs?.length + this.searchResponse?.articles?.length +this.searchResponse?.snippets?.length || 0);
          this.faqViewCount = (this.searchResponse.faqs && this.searchResponse.faqs.length <= 2) ? this.searchResponse.faqs.length : 2;
          this.articleViewCount = (this.searchResponse.articles && this.searchResponse.articles.length <= 2) ? this.searchResponse.articles.length : 2;
          this.snippetViewCount = (this.searchResponse.snippets && this.searchResponse.snippets.length <= 2) ? this.searchResponse.snippets.length : 2;
          this.faqAllView = this.searchResponse.faqs && this.searchResponse.faqs.length > 2 ? true : false;
          this.articleAllView = this.searchResponse.articles && this.searchResponse.articles.length > 2 ? true : false;
          this.snippetAllView = this.searchResponse.snippets && this.searchResponse.snippets.length > 2 ? true : false;
          this.searchResultText = this.searchResponse.totalSearchResults == 1 ? "Search result for" : "Search results for";
          // setTimeout(() => {
          //   this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
          //   this.handleSeeMoreButton(this.searchResponse.articles, this.projConstants.ARTICLE);
          //   this.handleSeeMoreButton(this.searchResponse.snippets, this.projConstants.SNIPPET);
          // }, 1000);
          this.checkFaqAnswerNotRenderCountAndRequest()
        } else if (this.answerPlaceableIDs.length > 0) {
    
          response.suggestions.faqs = this.rootService.formatFAQResponse(response.suggestions.faqs);
          let faqAnswerIdsPlace = this.answerPlaceableIDs.find(ele => ele.input == response.suggestions?.faqs[0].question);
          if (faqAnswerIdsPlace) {
            let accumulator = response.suggestions.faqs.reduce((acc, faq) => {
              if (faq.question == faqAnswerIdsPlace.input) {
                acc[faq.question] = faq;
                return acc;
              }
            }, {});
            this.searchResponse.faqs.forEach(faq => {
              if (accumulator[faq.question] && accumulator[faq.question].answer) {
                faq.answer = accumulator[faq.question].answer;
              }
            });
            let index = this.answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
            this.answerPlaceableIDs.splice(index, 1);
            // setTimeout(() => {
            //   this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
            // }, 1000);
          }
        }
        this.handleSubjectService.setSearchResponse(this.searchResponse);
      }
    }

    checkFaqAnswerNotRenderCountAndRequest(){
      let answerNotRenderendElements = (this.searchResponse.faqs || []).filter(faq => {
        return !faq.answer;
      });
      if(answerNotRenderendElements.length == 1){
        this.getFaqAnswerAndtoggle(answerNotRenderendElements[0]);
      }
    }
  
    getFaqAnswerAndtoggle(faq){
      faq.toggle = !faq.toggle;
      faq.seeMoreWrapper = false;
      if(!faq.answer && faq.toggle){
        this.answerPlaceableIDs.push({input : faq.question});
        let searchObj : any = {};
        searchObj.value = faq.displayName;
        searchObj.question = faq.question;
        // searchObj.searchFrom = this.commonService.activeTab;
        this.emitSearchRequest(searchObj.value, false);
      }
      // setTimeout(() => {
      //   this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
      // }, 10);
    }
}
