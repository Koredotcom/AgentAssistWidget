import { Injectable } from "@angular/core";
import { LocalStoreService } from "@kore.services/localstore.service";
import * as _ from 'lodash';
import mixpanel from 'mixpanel-browser';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class MixPanelService {
    userInfo: any = {};
    enabled = false;
    excludedMailDomains = ['mailinator.com', 'yopmail.com', 'abc.com', 'xyz.com', 'qq.com', 'vomoto.com', '.xyz'];

    events = {
        "Welcome screen loaded": {
            "Category": "Onboarding",
            "Description": "When the welcome carousel screen is loaded for the user",
            "Sub Category": "Welcome Screen"
        },
        "Instance setup complete": {
            "Category": "Onboarding",
            "Description": "When the user names his instance and taps on teh Next button",
            "Sub Category": "Welcome Screen"
        },
        "Welcome screen skipped": {
            "Category": "Onboarding",
            "Description": "When the user taps on the 'Skip for now' CTA on the Welcome screen carousel",
            "Sub Category": "Welcome Screen"
        },
        "SG - Setup Guide Start": {
            "Category": "Onboarding",
            "Description": "When the Setup guide is loaded, either during the onboarding experience, or when the user taps on the Setup guide from the top navigation menu",
            "Sub Category": "Setup guide"
        },
        "SG - Menu page loaded": {
            "Category": "Onboarding",
            "Description": "Triggered for the specific section in the setup guide that user is currently present in (Prototype, Agents, Bots, Channels, Experience flows)",
            "Sub Category": "Setup guide"
        },
        "SG - Make a call started": {
            "Category": "Onboarding",
            "Description": "When the user taps on the Make a call CTA from the onboarding setup guide",
            "Sub Category": "Setup guide"
        },
        "SG - Call input given": {
            "Category": "Onboarding",
            "Description": "When the user selects either 1,2 or 3 as an option from the numeric keyboard in the phone simulation",
            "Sub Category": "Setup guide"
        },
        "SG - Simulate a chat started": {
            "Category": "Onboarding",
            "Description": "When the user taps on the Simulate a chat CTA from the onboarding setup guide",
            "Sub Category": "Setup guide"
        },
        "SG - Chat input given": {
            "Category": "Onboarding",
            "Description": "When the user types a response and taps on enter in the simulation",
            "Sub Category": "Setup guide"
        },
        "SG - Watch Tutorial": {
            "Category": "Onboarding",
            "Description": "When the user taps on any of the Watch Tutorial CTAs from the onboarding setup guide",
            "Sub Category": "Setup guide"
        },
        "SG - Help doc viewed": {
            "Category": "Onboarding",
            "Description": "When the user taps on teh 'Help doc' CTA in any of the sections within the setup guide",
            "Sub Category": "Setup guide"
        },
        "SG - Agent desktop initiated": {
            "Category": "Onboarding",
            "Description": "When the user taps on 'Next' with teh default selection of 'Yes' for the agent desktop setup",
            "Sub Category": "Setup guide"
        },
        "SG - Add skills": {
            "Category": "Onboarding",
            "Description": "When the user taps on the 'Add skills' CTA in the Agent desktop setup",
            "Sub Category": "Setup guide"
        },
        "SG - Configure que": {
            "Category": "Onboarding",
            "Description": "When the user taps on 'Configure' CTA in que settings in agent desktop setup",
            "Sub Category": "Setup guide"
        },
        "SG - Add Agents": {
            "Category": "Onboarding",
            "Description": "When the user taps on the 'Add' CTA to add agents",
            "Sub Category": "Setup guide"
        },
        "SG - Configure Channels": {
            "Category": "Onboarding",
            "Description": "When the user taps on the Configure CTA from the Setup communication channels menu in the quick setup guide",
            "Sub Category": "Setup guide"
        },
        "SG - Explore Experience Flows": {
            "Category": "Onboarding",
            "Description": "When the user taps on the 'Explore' CTA in the Experience flows page from the setup guide",
            "Sub Category": "Setup guide"
        },
        "SG - Hide this guide": {
            "Category": "Onboarding",
            "Description": "When the user taps on 'Hide this guide' CTA during onboarding setup",
            "Sub Category": "Setup guide"
        },

        /** Engagement L1 */

        "Enter Experience Flows": {
            "Category": "Engagement L1",
            "Description": "When the user enters the Flows section from the experiences section in the left navigation menu OR  if he Taps on 'Create Experiences flow' from the Setup guide",
            "Sub Category": "Experiences - Flows"
        },
        "Experience Flow Created": {
            "Category": "Engagement L1",
            "Description": "When the user taps on the 'Create' OR 'Create amd continue to flow designer' CTA after naming his experience flow, description and Attaching a channel",
            "Sub Category": "Experiences - Flows"
        },
        "Experience Flow updated": {
            "Category": "Engagement L1",
            "Description": "When the user successfully edits the details of a flow (name, description or channel) and taps on Update OR Update and continue to flow design",
            "Sub Category": "Experiences - Flows"
        },
        "New Waiting Experience Created": {
            "Category": "Engagement L1",
            "Description": "When the user taps on the 'Save' after creating a new waiting experience",
            "Sub Category": "Experiences - Waiting experience"
        },
        "Waiting Experience Rule Added": {
            "Category": "Engagement L1",
            "Description": "When the user adds a routing rule to the waiting experience setup",
            "Sub Category": "Experiences - Waiting experience"
        },
        "Default Waiting Experience Modified": {
            "Category": "Engagement L1",
            "Description": "If the user taps on 'Save' after making changes to the default waiting experience in SmartAssist",
            "Sub Category": "Experiences - Waiting experience"
        },
        "Enter Use cases": {
            "Category": "Engagement L1",
            "Description": "When the user enters the use case section from the left navigation menu",
            "Sub Category": "Experiences - Use Cases"
        },
        "Start New Use Case": {
            "Category": "Engagement L1",
            "Description": "When the user taps on the '+ New use case' CTA",
            "Sub Category": "Experiences - Use Cases"
        },
        "Use case complete": {
            "Category": "Engagement L1",
            "Description": "When the user taps on 'Save' CTA on th use case config",
            "Sub Category": "Experiences - Use Cases"
        },
        "Use case modified": {
            "Category": "Engagement L1",
            "Description": "When the user taps on an existing use case and modifies either the voice or text respoinse and taps on the 'Save' CTA",
            "Sub Category": "Experiences - Use Cases"
        },
        "Enter Skills": {
            "Category": "Engagement L1",
            "Description": "When the user taps on the Skills tab from the routing section in the left navigation menu",
            "Sub Category": "Routing - Skills"
        },
        "New Skill group created": {
            "Category": "Engagement L1",
            "Description": "When the user successfully creates a new Skill group by tapping on the 'Create' CTA",
            "Sub Category": "Routing - Skills"
        },
        "New Skill Added": {
            "Category": "Engagement L1",
            "Description": "When the user successfully created a new Skill within the Skill group by tapping on the 'Create' CTA",
            "Sub Category": "Routing - Skills"
        },
        "Skill edited": {
            "Category": "Engagement L1",
            "Description": "When the user modifies an existing skill successfully after tapping on the 'Save' CTA",
            "Sub Category": "Routing - Skills"
        },
        "Enter hours of operation": {
            "Category": "Engagement L1",
            "Description": "When the user enters the operating hours section from the Routing menu in the left navigation menu",
            "Sub Category": "Routing - Hours of operation"
        },
        "Hours of operation Saved": {
            "Category": "Engagement L1",
            "Description": "When the user successfully creates or modifies the hours of operations after tapping on the 'Save' CTA",
            "Sub Category": "Routing - Hours of operation"
        },
        "Enter Agents": {
            "Category": "Engagement L1",
            "Description": "When the user enters the agents tab from the user management section on the left navigation menu",
            "Sub Category": "User Management - Agents"
        },
        "New Agent group created": {
            "Category": "Engagement L1",
            "Description": "When the user successfully creates a new agent group by tapping on 'Save' CTA",
            "Sub Category": "User Management - Agents"
        },
        "Agent group modified": {
            "Category": "Engagement L1",
            "Description": "When the user successfully changes any configurations of a Agent group and tapis on the 'Save' CTA ",
            "Sub Category": "User Management - Agents"
        },
        "New Agent Added": {
            "Category": "Engagement L1",
            "Description": "When the user taps on 'Save' CTA to successfully add an agent to a particular agent group",
            "Sub Category": "User Management - Agents"
        },

        /** Engagement L2 */

        "Enter Flow Test": {
            "Category": "Engagement L2",
            "Description": "When the user initiates the testing of his flow by either tapping on the Lab icon at the bottom right of the screen",
            "Sub Category": "Testing"
        },
        "Enter Test Call": {
            "Category": "Engagement L2",
            "Description": "When the user tests the call flow by tapping on the 'Call' CTA in the flow testing window",
            "Sub Category": "Testing"
        },
        "Test call phone number selected": {
            "Category": "Engagement L2",
            "Description": "When the user selects a particular phone number to test the flow",
            "Sub Category": "Testing"
        },
        "Test call input given (server side)": {
            "Category": "Engagement L2",
            "Description": "When the user gives an audio input to a conversation via testing in call mode",
            "Sub Category": "Testing"
        },
        "Enter Chat flow": {
            "Category": "Engagement L2",
            "Description": "When the user selects a Chat flow in the low testing window",
            "Sub Category": "Testing"
        },
        "Chat flow message sent": {
            "Category": "Engagement L2",
            "Description": "When the user types a particular response and sends to test the chat flow bot",
            "Sub Category": "Testing"
        },

        /** Engagement L3 */

        "Enter Channels": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the 'Channels' CTA from the left navigation menu",
            "Sub Category": "System Setup - Channels"
        },
        "Enter Add phone numbers": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the '+ New' CTA to add a new phone number as an integrated channel",
            "Sub Category": "System Setup - Channels"
        },
        "Enter Get New Phone number": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the 'Get new phone number' CTA on the Add phone numbers screen",
            "Sub Category": "System Setup - Channels"
        },
        "New Phone number selected": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the 'Get Number' CTA to get a new number ",
            "Sub Category": "System Setup - Channels"
        },
        "New Phone number added": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the 'Done' CTA to successfully add a new number as a call channel",
            "Sub Category": "System Setup - Channels"
        },
        "Enter new SIP transfer": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the '+ New' CTA to enter the section the to add an SIP URI to transfer calls to SmartAssist",
            "Sub Category": "System Setup - Channels"
        },
        "SIP Transfer setup complete": {
            "Category": "Engagement L3",
            "Description": "When the user taps on the 'Save' CTA to successfully add a SIP transfer setup",
            "Sub Category": "System Setup - Channels"
        },
        "Enter Agent Transfer": {
            "Category": "Engagement L3",
            "Description": "When the user enters the 'Agent transfer' section from the left navigation menu",
            "Sub Category": "System Setup - Agent Transfer"
        },
        "Outgoing Voice Agent Transfer completed": {
            "Category": "Engagement L3",
            "Description": "When the user successfully integrates an outgoing voice transfer channel by tapping on the 'Done' CTA",
            "Sub Category": "System Setup - Agent Transfer"
        },
        "Outgoing Chat Agent Transfer completed": {
            "Category": "Engagement L3",
            "Description": "When the user successfully integrates an outgoing voice transfer channel by tapping on the 'Done' CTA",
            "Sub Category": "System Setup - Agent Transfer"
        },
        "Flow published": {
            "Category": "Engagement L3",
            "Description": "When the user publishes a particular user flow on either a voice or chat channel",
            "Sub Category": "Experiences Flows"
        },
        "Bot published": {
            "Category": "Engagement L3",
            "Description": "When the user publishes a particular bot on either a voice or chat channel",
            "Sub Category": "Experiences Flows"
        },
        "Enter Surveys": {
            "Category": "Engagement L3",
            "Description": "When the user enters the 'Surverys' section from System setup in the left navigation menu",
            "Sub Category": "System setup - Survey"
        }
    }
    constructor(
        private localstorage: LocalStoreService,
    ) {

    }
    checkForEmailDomains(email) {
        var valid = true;
        this.excludedMailDomains.forEach(function (domain) {
            if (email.includes(domain)) {
                valid = false;
            }
        });
        this.enabled = valid;
        try {
            const env: any = environment;
            if (env.hasOwnProperty('MIX_PANEL_DEV')) {
                if (env.MIX_PANEL_DEV) {
                    this.enabled = true;
                }
            }
        } catch (e) {

        }
        return this.enabled;
    };
    reset() {
        this.enabled = false;
        this.userInfo = {};
        try {
            if (mixpanel && mixpanel.reset) {
                mixpanel.reset();
            }
        } catch (e) {
            return;
        }
    };
    setAnanomus(email) {
        this.checkForEmailDomains(email);
        if (!this.enabled) {
            return;
        }
        try {
            if (mixpanel && mixpanel.reset) {
                mixpanel.reset();
                // mixpanel.alias(email);
                mixpanel.identify(email);
            }
        } catch (e) {
            return;
        }
    };
    setUserInfo(email, userInfo) {
        userInfo = userInfo || {};
        this.reset();
        this.checkForEmailDomains(email);
        if (!this.userInfo.emailId) {
            this.userInfo.emailId = email;
        }
        if (!this.enabled) {
            return;
        }
        if (userInfo) {
            try {
                if (mixpanel && mixpanel.people) {
                    if (email) {
                        this.userInfo.emailId = email;
                        mixpanel.identify(email);
                    }
                    userInfo.Time = new Date().toISOString();
                    mixpanel.people.set(userInfo);
                }
            } catch (e) {
                return;
            }
        } else {
            try {
                if (mixpanel) {
                    this.userInfo.emailId = email;
                    mixpanel.identify(email);
                }
            } catch (e) {
                return;
            }
        }

    };
    postEvent(event, eventPayload) {
        const jStorage = this.localstorage.getAuthInfo();
        if (jStorage && jStorage.currentAccount && jStorage.currentAccount.userInfo) {
            this.userInfo = jStorage.currentAccount.userInfo;
        }
        let _userInfo = this.userInfo;
        if (!this.userInfo) {
            return;
        }
        eventPayload = eventPayload || {};
        if (_userInfo) {
            eventPayload.$email = _userInfo.emailId;
            eventPayload.$name = _userInfo.fName + ' ' + _userInfo.lName;
            eventPayload.Name = _userInfo.fName + ' ' + _userInfo.lName;
            eventPayload.orgId = _userInfo.orgId;
            eventPayload.accountId = _userInfo.accountId;
            if (!this.userInfo.emailId) {
                this.setUserInfo(_userInfo.emailId, eventPayload); // sets the user identity on reload or tab close events
            }
        }
        var emailId = eventPayload.$email || eventPayload.Email || ((_userInfo && _userInfo.emailId) ? _userInfo.emailId : '');
        if (this.userInfo.emailId && (emailId !== this.userInfo.emailId)) {
            this.reset();
            try {
                mixpanel.identify(emailId);
            } catch (e) {
                return;
            }
            this.checkForEmailDomains(emailId);
        }
        eventPayload = eventPayload || {};
        if (!this.checkForEmailDomains(emailId)) {
            return;
        }
        if (eventPayload) {
            try {
                if (mixpanel && event) {
                    mixpanel.track(event, eventPayload);
                }
            } catch (e) {
                return;
            }
        } else {
            try {
                if (mixpanel && event) {
                    mixpanel.track(event);
                }
            } catch (e) {
                return;
            }
        }

    };
}
