import { Permission, Role, User } from "./user-management.model";

import * as moment from 'moment';

export const PERMISSIONS_LIST: Permission[] = [
    {
        "id": "AGENT",
        "name": "Agent",
        "description": "Can Manage Agents",
        "category": "agent_desktop",
        "group": "AgentDesktop",
        "_product": [
            "AgentDesktop",
            "SmartAssist"
        ],
        "operations": [
            "NO",
            "VIEW",
            "FULL"
        ]
    },
    {
        "id": "NATURAL_LANG",
        "name": "Natural Language",
        "description": "Manage natural language training data (utterances, patterns, synonyms etc.), configurations and thresholds.",
        "category": "agent_desktop",
        "group": "AgentDesktop",
        "_product": [
            "AgentDesktop",
            "SmartAssist"
        ],
        "operations": [
            "NO",
            "VIEW",
            "FULL"
        ]
    },
    {
        "id": "DASHBOARD",
        "name": "Dashboard",
        "description": "View & export dashboard data.",
        "category": "agent_desktop",
        "group": "AgentDesktop",
        "_product": [
            "AgentDesktop",
            "SmartAssist"
        ],
        "operations": [
            "NO",
            "VIEW"
        ]
    }
]

export const ROLES_LIST: Role[] = [
    {
        "id": "60e50920b2f2c8614490c8d0",
        "role": "Agent Skill Manger",
        "rDesc": "A role to assign/remove skills from agents.",
        "permissions": {
          "AGENT": [
            "FULL"
          ],
          "AGENT_GROUP": [
            "VIEW"
          ],
          "SKILL": [
            "FULL"
          ]
        },
        "orgId": "o-5e839231-97c4-538e-add0-f1ecd6514561",
        "refId": "48dce84b-57c2-5d55-8e3d-96820cdd6d9b",
        "rStatus": "unpublished",
        "createdDate": "2021-07-07T06:45:00.849Z",
        "modifiedDate": moment("2021-07-07T06:45:00.849Z"),
        "createdBy": "u-f4391555-7210-589d-9363-931675b8d418",
        "modifiedBy": "u-f4391555-7210-589d-9363-931675b8d418",
        "isASystemRole": false,
        "category": "agent_desktop",
        "memberName": "",
        "_userAndGroups": [
          "u-f4391555-7210-589d-9363-931675b8d418"
        ],
        "settings": {},
        "isDefault": false,
        "_product": [
          "AgentDesktop",
          "SmartAssist"
        ]
    },
    {
        "id": "60e50920b2f2c8614490c8d1",
        "role": "Agent Skill Manager",
        "rDesc": "A role to assign/remove skills from agents and this is the second one that needs to be checked.",
        "permissions": {
          "AGENT": [
            "FULL"
          ],
          "AGENT_GROUP": [
            "VIEW"
          ],
          "SKILL": [
            "FULL"
          ]
        },
        "orgId": "o-5e839231-97c4-538e-add0-f1ecd6514561",
        "refId": "48dce84b-57c2-5d55-8e3d-96820cdd6d9b",
        "rStatus": "unpublished",
        "createdDate": "2021-07-07T06:45:00.849Z",
        "modifiedDate": moment("2021-07-07T06:45:00.849Z"),
        "createdBy": "u-f4391555-7210-589d-9363-931675b8d418",
        "modifiedBy": "u-f4391555-7210-589d-9363-931675b8d418",
        "isASystemRole": false,
        "category": "agent_desktop",
        "memberName": "",
        "_userAndGroups": [
          "u-f4391555-7210-589d-9363-931675b8d418"
        ],
        "settings": {},
        "isDefault": false,
        "_product": [
          "AgentDesktop",
          "SmartAssist"
        ]
    }
]

export var USERS: User[] = [

]