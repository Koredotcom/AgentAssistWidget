export interface IAnalyticsFilters {
    startDate: string,
    endDate: string,
    type?: string
}

export interface IDashboardFilter{
    startDate: string | any,
    endDate: string | any,
    experience: string,
    botId?:string
}
