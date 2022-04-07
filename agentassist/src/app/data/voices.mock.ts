export const VOICECHANNEL_TRASFER_MOCKDATA = {
    phoneNumbers: [
        {
            "_id": "ph-asd456asdad",
            "phoneNumber": "+12564750313",
            "countryCode": "US",
            "phoneNumberType": "local",
            "price": "1.00",
            "inbound_price": "0.0085",
            "currencyType": "USD",
            "callFlowDetails": [
                {
                    "_id": "cf-1c61f0a9-fca9-5be6-8265-57b40c1de0ad",
                    "name": "jan_10 1",
                    "state": "configured",
                    "didNumber": "+12512912348"
                }
            ]
        },
        {
            "_id": "ph-asd456asdad",
            "phoneNumber": "+12564750313",
            "countryCode": "US",
            "phoneNumberType": "local",
            "price": "1.00",
            "inbound_price": "0.0085",
            "currencyType": "USD",
            "callFlowDetails": [
                {
                    "_id": "cf-1c61f0a9-fca9-5be6-8265-57b40c1de0ad",
                    "name": "jan_10 1",
                    "state": "configured",
                    "didNumber": "+12512912348"
                }
            ]

        },
                        {
            "_id": "ph-asd456asdad",
            "phoneNumber": "+12564750313",
            "countryCode": "US",
            "phoneNumberType": "local",
            "price": "1.00",
            "inbound_price": "0.0085",
            "currencyType": "USD",
            "callFlowDetails": [
                {
                    "_id": "cf-1c61f0a9-fca9-5be6-8265-57b40c1de0ad",
                    "name": "jan_10 1",
                    "state": "configured",
                    "didNumber": "+12512912348"
                }
            ]
        }
    ],
    sipTransfers: [
        {
            "_id" : "sip-fasfasd456qwe",
            "sipURI": "sip:54.161.251.110:5060",
            "network": "listofIp",
            "languagePreference": "en_US",
            "didNumber": [
                "+876765654765"
            ],
            "sipTransportType": "UDP",
            "sipUserName": "",
            "sipPassword": "",
            "incomingIpAddresses": [
                "123.0.0.1"
            ],
            "callFlowDetails": [
                {
                    "_id": "cf-1c61f0a9-fca9-5be6-8265-57b40c1de0ad",
                    "name": "jan_10 1",
                    "state": "configured",
                    "didNumber": "+12512912348"
                }
            ]
        },
        {
            "_id" : "sip-fasfasd456qwe",
            "sipURI": "sip:54.161.251.110:5060",
            "network": "listofIp",
            "languagePreference": "en_US",
            "didNumber": [
                "+876765654765"
            ],
            "sipTransportType": "UDP",
            "sipUserName": "",
            "sipPassword": "",
            "incomingIpAddresses": [
                "123.0.0.1"
            ],
            "callFlowDetails": [
                {
                    "_id": "cf-1c61f0a9-fca9-5be6-8265-57b40c1de0ad",
                    "name": "jan_10 1",
                    "state": "configured",
                    "didNumber": "+12512912348"
                }
            ]
        },
        {
            "_id" : "sip-fasfasd456qwe",
            "sipURI": "sip:54.161.251.110:5060",
            "network": "listofIp",
            "languagePreference": "en_US",
            "didNumber": [
                "+876765654765"
            ],
            "sipTransportType": "UDP",
            "sipUserName": "",
            "sipPassword": "",
            "incomingIpAddresses": [
                "123.0.0.1"
            ],
            "callFlowDetails": [
                {
                    "_id": "cf-1c61f0a9-fca9-5be6-8265-57b40c1de0ad",
                    "name": "jan_10 1",
                    "state": "configured",
                    "didNumber": "+12512912348"
                }
            ]
        }
    ]
}

export interface INewVoicesTransfer {
    phoneNumbers: [
        {
            "_id": "",
            "phoneNumber": "",
            "countryCode": "",
			"phoneNumberType": "",
			"price": "",
			"inbound_price": "",
			"currencyType": "",
            "callFlowDetails": [
                {
                    "_id": "",
                    "name": "",
                    "state": "",
                    "didNumber": ""
                }
            ]
        }
    ],
    sipTransfers: [
        {
           "_id" : "",
           "sipURI": "",
           "network": "",
           "languagePreference": "",
           "didNumber": [],
           "sipTransportType": "",
           "sipUserName": "",
           "sipPassword": "",
           "incomingIpAddresses": [],
            "callFlowDetails": [
                {
                    "_id": "",
                    "name": "",
                    "state": "",
                    "didNumber": ""
                }
            ]
       }
   
    ]
}
