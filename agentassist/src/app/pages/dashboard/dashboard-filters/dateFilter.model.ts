export interface IAnalyticsFilters {
    startDate: string,
    endDate: string,
    type?: string
}

export const CHANNELS = {
    'ALL' : 'All Channels',
    'WHATSAPP' : 'Whatsapp',
    'SLACK' : 'Slack'
}