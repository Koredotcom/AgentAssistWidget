

export interface SummaryModel {
    configuration: {
        callSetup: {
            type: 'IVR' | 'phoneNumber',
            isSetUpCompleted: boolean,
            sipDomainConfigDetails?: {
                sipDomainName: string,
                incomingIpAddresses: string[],
                languagePreference: string
            },
            phoneNumberConfigDetails?: {
                countryCode: string;
                phoneNumber: string;
            }
        },
        virtualAssistant: {
            "type": 'voice' | 'chat',
            "enabled": boolean,
            "faqCount": number,
            "intentCount": number

        },
        handOff: {
            "formSubmission": boolean,
            "liveAgent": boolean,
            isFormCompleted: boolean,
            "isAgentDetailsCompleted": boolean,
            "formSubmissionType": "agentEmail",
            "formDetails": {
                "formName": string,
                "agentEmail": string,
                "payloadFields": any[],
            },
            "agentDetails": {
                "agentName": string,
                "liveAgentUrl": string,
                "organizationId": string,
                "deploymentId": string,
                "buttonId": string,
                "SFDC_TOKEN_URL": string,
                "SFDC_API_URL": string,
                "client_id": string,
                "client_secret": string
            }
        }
    },
    todaysActivity: ActivityGroup[],
    changelogs: any[]
}

export interface ActivityGroup {
    key: string,
    items: ActivityItem[]
}

export interface ActivityItem {
    "label": string,
    "noofusers": number,
    "percentage": number
}


export const SummaryMockData: SummaryModel = {
    configuration: {
        callSetup: {
            type: 'phoneNumber',
            isSetUpCompleted: true,
            sipDomainConfigDetails: {
                sipDomainName: "mockData",
                incomingIpAddresses: [],
                languagePreference: "mockData"
            },
            phoneNumberConfigDetails: {
                countryCode: "mockData",
                phoneNumber: "mockData",
            }
        },
        virtualAssistant: {
            "type": 'voice',
            "enabled": true,
            "faqCount": 20,
            "intentCount": 30

        },
        handOff: {
            "formSubmission": true,
            "liveAgent": true,
            isFormCompleted: true,
            "isAgentDetailsCompleted": true,
            "formSubmissionType": "agentEmail",
            "formDetails": {
                "formName": "fsd",
                "agentEmail": "fdsfs",
                "payloadFields": [],
            },
            "agentDetails": {
                "agentName": "mockData",
                "liveAgentUrl": "mockData",
                "organizationId": "mockData",
                "deploymentId": "mockData",
                "buttonId": "mockData",
                "SFDC_TOKEN_URL": "mockData",
                "SFDC_API_URL": "mockData",
                "client_id": "mockData",
                "client_secret": "mockData"
            }
        }
    },
    todaysActivity: [{
        key: "inprogress",
        "items": [{
            "label": "In Progress",
            "noofusers": 472,
            "percentage": 32
        }]
    },
    {
        key: "users",
        "items": [{
            "label": "Users",
            "noofusers": 472,
            "percentage": 32
        },
        {
            "label": "Total Users",
            "noofusers": 472,
            "percentage": 32
        }
        ]
    },

    {
        key: "users",
        "items": [{
            "label": "Fullfilled via Autmation ",
            "noofusers": 472,
            "percentage": 32
        },
        {
            "label": "Handed-off to Agents",
            "noofusers": 472,
            "percentage": -32
        }

        ]
    }
    ],
    changelogs: [{
        "_id": "btl-20c00fe7-2762-5ed6-aefd-56e83ee68442",
        "userId": {
            "id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "firstName": "m",
            "lastName": "3",
            "emailId": "m3@mail.com",
            "activationStatus": "active",
            "profColour": "#ff8c00",
            "profImage": "no-avatar",
            "_id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "orgId": "o-4209d070-b700-5274-9d3e-b19abc165f0f"
        },
        "message": "Hold & Resume settings updated for mark down",
        "streamId": "st-a8cebbe4-9548-50c5-9a5b-c81b7c4706b9",
        "resourceId": "dg-75ef211b-3fdd-546e-8f57-bb1e89ecd487",
        "resourceType": "Dialog",
        "createdOn": "2020-06-26T06:32:25.774Z",
        "__v": 0,
        "_resolve": [
            "userId"
        ]
    },
    {
        "_id": "btl-20c00fe7-2762-5ed6-aefd-56e83ee68442",
        "userId": {
            "id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "firstName": "m",
            "lastName": "3",
            "emailId": "m3@mail.com",
            "activationStatus": "active",
            "profColour": "#ff8c00",
            "profImage": "no-avatar",
            "_id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "orgId": "o-4209d070-b700-5274-9d3e-b19abc165f0f"
        },
        "message": "Hold & Resume settings updated for mark down",
        "streamId": "st-a8cebbe4-9548-50c5-9a5b-c81b7c4706b9",
        "resourceId": "dg-75ef211b-3fdd-546e-8f57-bb1e89ecd487",
        "resourceType": "Dialog",
        "createdOn": "2020-06-26T06:32:25.774Z",
        "__v": 0,
        "_resolve": [
            "userId"
        ]
    },
    {
        "_id": "btl-20c00fe7-2762-5ed6-aefd-56e83ee68442",
        "userId": {
            "id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "firstName": "m",
            "lastName": "3",
            "emailId": "m3@mail.com",
            "activationStatus": "active",
            "profColour": "#ff8c00",
            "profImage": "no-avatar",
            "_id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "orgId": "o-4209d070-b700-5274-9d3e-b19abc165f0f"
        },
        "message": "Hold & Resume settings updated for mark down",
        "streamId": "st-a8cebbe4-9548-50c5-9a5b-c81b7c4706b9",
        "resourceId": "dg-75ef211b-3fdd-546e-8f57-bb1e89ecd487",
        "resourceType": "Dialog",
        "createdOn": "2020-06-26T06:32:25.774Z",
        "__v": 0,
        "_resolve": [
            "userId"
        ]
    },
    {
        "_id": "btl-20c00fe7-2762-5ed6-aefd-56e83ee68442",
        "userId": {
            "id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "firstName": "m",
            "lastName": "3",
            "emailId": "m3@mail.com",
            "activationStatus": "active",
            "profColour": "#ff8c00",
            "profImage": "no-avatar",
            "_id": "u-411e6be2-552b-50af-b846-136a1f3be507",
            "orgId": "o-4209d070-b700-5274-9d3e-b19abc165f0f"
        },
        "message": "Hold & Resume settings updated for mark down",
        "streamId": "st-a8cebbe4-9548-50c5-9a5b-c81b7c4706b9",
        "resourceId": "dg-75ef211b-3fdd-546e-8f57-bb1e89ecd487",
        "resourceType": "Dialog",
        "createdOn": "2020-06-26T06:32:25.774Z",
        "__v": 0,
        "_resolve": [
            "userId"
        ]
    }]

}