export const DASHBORADCOMPONENTTYPE = {
    AGENT_FEEDBACK : 'AGENT_FEEDBACK',
    AGENT_ASPECT : 'AGENT_ASPECT',
    CUSTOMER_ASPECT : 'CUSTOMER_ASPECT',
    AUTOMATION_OVERRIDE : 'AUTOMATION_OVERRIDE',
    AUTOMATION_PERFORMANCE : 'AUTOMATION_PERFORMANCE'
};

export const VIEWTYPE = {
    EXHAUSTIVE_VIEW : 'exhaustive',
    PARTIAL_VIEW : 'partial',
    WORDCLOUD : 'wordcloud',
    TABLE : 'table'
};

export const COMPONENTVSTITLE = {
    AGENT_FEEDBACK : 'Agent Feedback',
    AGENT_ASPECT : 'What are your agents looking for?',
    CUSTOMER_ASPECT : 'What are your customers looking for?',
    AUTOMATION_OVERRIDE : 'Automation Override Report',
    AUTOMATION_PERFORMANCE : 'Automation Performance'
}

export const COMPONENTVSSUBTITLE = {
    AGENT_FEEDBACK : 'TRAINING',
    AGENT_ASPECT : 'SEARCH',
    CUSTOMER_ASPECT : 'AUTOMATION',
    AUTOMATION_OVERRIDE : 'SEARCH',
    AUTOMATION_PERFORMANCE : 'ACCURACY'
}

export const actualvsDisplayTitle = {
    CUSTOMER_ASPECT_DROPDOWN_LIST : ['All','Agent_Initiated', 'Agent_Suggested'],
    CUSTOMER_ASPECT_TABS_LIST : ['All', 'Articles', 'Faqs', 'Automations'],
    CUSTOMER_ASPECT_TYPE_VS_IMAGE : {
        'Articles' : 'assets/icons/dashboard/articles.svg',
        'Faqs' : 'assets/icons/dashboard/faqs.svg',
        'Automations' : 'assets/icons/dashboard/automation.svg' 
    }
}

export const CHANNELS = ['ALL','WHATSAPP','SLACK', 'MIS_TEAMS', 'TWILIO']