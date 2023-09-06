export interface IAnalyticsFilters {
    startTime: string,
    endTime: string,
    type?: string
}

export interface IDashboardFilter{
    startTime: string,
    endTime: string,
    experience: string,
    botId?:string
}
