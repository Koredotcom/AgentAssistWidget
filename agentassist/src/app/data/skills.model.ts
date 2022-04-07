export interface SkillGp {
    id?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    name: string;
    description: string;
    points: number;
    isSkillPointsEnabled: boolean;
    skillsCount?: number;
    agentName?: string;
    skills?: Skill[];
    isSkillsLoading?: boolean;
    isOpen?: boolean;
    color?: string;
}

export interface SkillGpRsp {
    results: SkillGp[];
    hasMore: boolean;
    limit: number;
    skip: number;
    totalPages: number;
    totalResults: number;
}

export interface AgentShort {
    userId: string;
    proficiencyLevel: string;
}
export interface Agent {
    userId: string;
    proficiency: 'novice' | 'average' | 'good' | 'expert';
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    profImage: string;
}

export interface Skill {
    id?: string;
    _id?: string;
    name: string;
    status?: 'ACTIVE' | 'INACTIVE';
    isMandatory: boolean;
    description: string;
    color?: string;
    points: number;
    priorityAging: boolean;
    priorityAgingSettings?: {
        interval: number;
        change: number;
        maximumChange: number;
    };
    skillGroupId: string;
    agents: AgentShort[];
}

export interface SkillRsp {
    results: Skill [];
    hasMore: boolean;
    limit: number;
    skip: number;
    totalPages: number;
    totalResults: number;
}

export interface SkillsLite {
    name: string;
    id: string;
    type: 'skill' | 'skillGp';
    count?: number;
    color: string;
}