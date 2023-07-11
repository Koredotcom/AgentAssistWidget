interface SliderData {
	vChild: string;
	selector: string;
	widthClass: string;
	flag: string;
}

export type SettingsTabs = 'insetup' | 'outsetup' | 'sdk' | 'advance';

export interface IncomingPhoneNumSetupModel {
	type: '' | 'phoneNumber',
	settings: {
		phoneNumber: string,
		countryCode: string,
		phoneNumberType: '' | 'local' | 'tollFree'
	}
}

export interface IncomingSIPSetupModel {
	type: '' | 'IVR',
	settings: {
		"sipURI": string,
		"network": string,
		"didNumber": string[],
		"sipTransportType": string,
		"sipUserName": string,
		"sipPassword": string,
	}
}

export interface IncomingSetupModel {
	type: '' | 'phoneNumber' | 'IVR',
	voiceChannel: '' | 'audiocodes' | 'twillovoice',

	phoneNumberConfigDetails: {
		phoneNumber: string,
		countryCode: string,
		phoneNumberType: '' | 'local' | 'tollFree'

	},
	sipDomainConfigDetails: {
		sipURI: string,
		network: string,
		incomingIpAddresses: string[],
		languagePreference: "en_US",
		didNumber: string[],
		sipTransportType: string,
		sipUserName: string, //optional
		sipPassword: string //optional
	},
	languagePreference: "en_US"
}

export const IncomingSetupData = {
	type: "phoneNumber",
	voiceChannel: "audiocodes",

	phoneNumberConfigDetails: {
		phoneNumber: '',
		countryCode: '',
		phoneNumberType: ''

	},
	sipDomainConfigDetails: {
		sipURI: '',
		network: '',
		incomingIpAddresses: [],
		languagePreference: "en_US",
		didNumber: [],
		sipTransportType: '',
		sipUserName: '', //optional
		sipPassword: '' //optional
	},
	languagePreference: "en_US"
}

export interface BotAddressModel {
	customerName: string,
	street: string,
	city: string,
	region: string,
	country: string,
	postalCode?: string,
	isoCountry?: string 
}

export interface ConfiguredAddressModel {
	validated: boolean,
	verified: boolean,
	sid: string,
	city: string,
	customerName: string,
	dateCreated: string,
	isoCountry: string,
	postalCode: string,
	region: string
}


export interface VoicePreferencesModel {
	"asrPreference": string;
	"ttsPreference": string;
	"voicePreference": string;
	"languagePreference"?: string;
	"dialectPreference"?: string;
	"callControlParameters"?: any
}


export interface SIPConfig {
	additionalContext: { name: string, value: string, enabled: boolean }[],
	sipTransferId: string,
	userToUser: { enabled: true, payload: string }
}

export interface SIPPayload {
	name: 'sipTransfer',
	type: 'voice',
	config: SIPConfig
}

export interface SDKWidgetModel {
	"_id": string,
	"streamId": string,
	"createdBy": string,
	"createdOn": string,
	"lastModifiedBy": string,
	"lastModifiedOn": string,
	"state": "configured" | "published" | "",
	"theme": string,
	"font": string,
	"assistantName": string,
	"descEnabled": boolean,
	"desc": string,
	"logoEnabled": boolean,
	"logo": string,
	"headerBgColor": string,
	"headerTextColor": string,
	"headerTemplate": "type1" | "type2" | "type3" | "type4",
	"bodyBgColor": string,
	"timeStampEnabled": boolean,
	"userchatBgColor": string,
	"userchatTextColor": string,
	"userIconEnabled": boolean,
	"userIcon": string,
	"botchatBgColor": string,
	"botchatTextColor": string,
	"buttonBgColor": string,
	"buttonTextColor": string,
	"botIconEnabled": boolean,
	"botIcon": string,
}


