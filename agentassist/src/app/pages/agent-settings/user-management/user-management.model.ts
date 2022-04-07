import { Moment } from "moment";

type Permissions = 'FULL' | 'VIEW' | 'NO';
type Products = 'AgentDesktop' | 'SmartAssist';

export const MENU = [
    // {
    // name: 'User',
    // id: 'user',
    // img: 'assets/icons/agent-settings/user-managment.svg'
    // }, 
    {
        name: 'Role Management',
        id: 'role',
        img: 'assets/icons/agent-settings/role-managment.svg'
    }];

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface UserRsp {
    results: User [];
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
    totalResults: number;
}

export interface RoleAddEdit {
    role: string;
    desc: string;
    permissions: {
        AGENT: Permissions [],
        AGENT_GROUP: Permissions [],
        SKILL: Permissions []
    }
}

export interface Role {
    id: string;
    role: string;
    rDesc: string;
    permissions: {
        AGENT: [
            'FULL' | 'VIEW'
        ],
        AGENT_GROUP: [
            'FULL' | 'VIEW'
        ],
        SKILL: [
            'FULL' | 'VIEW'
        ]
    },
    orgId: string;
    refId: string;
    rStatus: string;
    createdDate: string;
    modifiedDate: Moment;
    createdBy: string;
    modifiedBy: string;
    isASystemRole: boolean;
    category: string;
    memberName: string;
    _userAndGroups: [ string ];
    settings: {};
    isDefault: boolean;
    _product: string [];
    isChecked?: boolean;
}
export interface RolesRsp {
    results: Role [];
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
    totalResults: number;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
    group: string;
    _product: Products [];
    operations: Permissions [];
}

export interface PermissionRsp {
    results: Permission [];
}