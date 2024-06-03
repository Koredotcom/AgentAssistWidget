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
    AGENT_FEEDBACK : "DASHBOARD.AGENT_FEEDBACK_TITLE",
    AGENT_ASPECT : "DASHBOARD.AGENT_ASPECT_TITLE",
    CUSTOMER_ASPECT : "DASHBOARD.CUSTOMER_ASPECT_TITLE",
    AUTOMATION_OVERRIDE : "DASHBOARD.AUTOMATION_OVERRIDE_TITLE",
    AUTOMATION_PERFORMANCE : "DASHBOARD.AUTOMATION_PERFORMANCE_TITLE"
}

export const COMPONENTVSSUBTITLE = {
    AGENT_FEEDBACK : "DASHBOARD.AGENT_FEEDBACK_SUBTITLE",
    AGENT_ASPECT : "DASHBOARD.AGENT_ASPECT_SUBTITLE",
    CUSTOMER_ASPECT : "DASHBOARD.CUSTOMER_ASPECT_SUBTITLE",
    AUTOMATION_OVERRIDE : "DASHBOARD.AUTOMATION_OVERRIDE_SUBTITLE",
    AUTOMATION_PERFORMANCE : "DASHBOARD.AUTOMATION_PERFORMANCE_SUBTITLE"
}

export const actualvsDisplayTitle = {
    CUSTOMER_ASPECT_DROPDOWN_LIST : ['all','agent', 'agentassist'],
    CUSTOMER_ASPECT_TABS_LIST : ['all', 'answer', 'faq', 'dialog', 'article'],
    CUSTOMER_ASPECT_TYPE_VS_IMAGE : {
        'article' : 'assets/icons/dashboard/articles.svg',
        'faq' : 'assets/icons/dashboard/faqs.svg',
        'dialog' : 'assets/icons/dashboard/automation.svg'
    },
    FEEDBACK_TABS_LIST : {
        usecases : 'Automations',
        // answers : 'Answers & Web Pages',
        // faq : 'FAQs',
        // files : 'Files'
    },
    FEEBDACK_TYPES_VS_IMAGE : {
        'answers' : 'assets/icons/dashboard/articles.svg',
        'faq' : 'assets/icons/dashboard/faqs.svg',
        'usecases' : 'assets/icons/dashboard/automation.svg',
        'files' : 'assets/icons/dashboard/articles.svg'
    },
    FEEDBACK_TABLE_COLNAME : {
        usecases : 'AUTOMATION NAME',
        answers : 'ANSWER & WEB PAGE NAME',
        faq : 'FAQ NAME',
        files : 'FILE NAME'
    },
    NEGATIVE_FEEDBACK_MAP : {
        'Wrong suggestions' : 'WrongSuggestion',
        'Incorrect intent' : 'Incorrect intent',
        'Accidental click' : 'Accidental Click',
        'Time Taking' : 'Time Taking', 
        'Others' : 'Others'
    }
}

export const CHANNELS = ['chat', 'voice', 'email']
