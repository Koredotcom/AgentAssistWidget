export class EditField {
    formData: FormData;
    payloadField: PayloadField[];
    constructor(userData: any) {
        this.formData = userData.formData;
        this.payloadField = userData.payloadField.map((val)=>{
            return new PayloadField(val);
        })
    }

}

export interface FormData {
    formName: string;
    agentEmail: string;
}

export class PayloadField {
    fieldName: string;
    displayName: string;
    helpText: string;
    dataType : string;
    fieldType: string;
    isOptional: string;
    isMultiSelect: string;
    operation: string;
    fieldIndex: number;
    isEdit: boolean;

    constructor(payload: any) {
        this.fieldName = payload.key;
        this.dataType = payload.type;
        this.helpText = payload.help;
        this.displayName = payload.title;
        this.fieldType = payload.fieldType;
        this.isOptional = payload.isRequired?"No":"Yes";
        this.isMultiSelect = payload.isMultiSelect?"Yes":"No";         
        this.operation = '';
        this.fieldIndex = payload.fieldIndex;
        this.isEdit = false;
    }
}

export class FormFieldPayload {
    key: string;
    title: string;
    help: string;
    fieldType: string;
    isRequired: boolean;
    isMultiSelect: boolean;
    getFromSession: {};
    type: string;
    dependsOn: [];
    transpose: boolean;
    metadata: string;
    fieldIndex: string;

    constructor(payload: any) {
        this.key = payload.fieldName;
        this.title = payload.fieldName;
        this.help = payload.helpText;
        this.fieldType = payload.fieldType;
        this.isRequired = payload.isOptional == "Yes"?false:true;
        this.isMultiSelect = payload.isMultiSelect == "Yes"?true:false;
        this.getFromSession = {
          enabled: false
        };
        this.type = payload.dataType;
        this.dependsOn = [];
        this.transpose = false;
        this.metadata = 'label';
        this.fieldIndex = payload.fieldIndex;
    }
}


export class FormFieldPayloadMini {
    key: string;
    help: string;
    title: string;
    type: string;
    fieldType: string;
    isRequired: boolean;
    isMultiSelect: boolean;
    constructor(payload: any) {
        this.key = payload.fieldName;
        this.help = payload.helpText;
        this.title = payload.fieldName;
        this.type = payload.dataType;
        this.fieldType = payload.fieldType;
        this.isRequired = payload.isOptional == 'Yes'?false:true;
        this.isMultiSelect = payload.isMultiSelect == 'Yes'?true:false;
    }
}

export const FIELD_TYPE_LIST = [{
    name: 'Date',
    id: 'date'
  }, {
    name: 'URL',
    id: 'url'
  }, {
    name: 'Textbox',
    id: 'textbox'
  }, {
    name: 'Static Dropdown',
    id: 'staticDropDown'
  }, {
    name: 'Textarea',
    id: 'textarea'
  }, {
    name: 'Type Ahead',
    id: 'typeahead'
  }, {
    name: 'Email',
    id: 'email'
  }, {
    name: 'File Upload',
    id: 'file'
  }, {
    name: 'Date & Time',
    id: 'datetime'
  }, {
    name: 'Time Zone',
    id: 'timezone'
  }];

  export const DEFAULT_FIELDS = {
    fieldType: 'textbox',
    dataType: 'string',
    dFormat: 'MM-dd-YYYY',
    endPointContType:'JSON',
    dTFormat: 'MM-DD-YYYY hh:mm:ss',
    endPointMethod: 'GET',
    defaultSelVal: "",
    payloadFieldValue: "",
    multiFile: "Yes"
  }

  export const ENDPOINT_CONTENT_TYPE = [
    'JSON', 'RSS', 'XML', 'URL Encoded JSON', 'CSV', 'Text', 'Twitter Encoded JSON', 'Multipart/Form-data', 'Multipart/Related', 'Oracle ADF'
  ];

  export const DATE_TIME_FORMAT = ['DD-MM-YYYY hh:mm:ss', 'MM-DD-YYYY hh:mm:ss', 'DD-MM-YY hh:mm:ss', 'YYYY-MM-DD hh:mm:ss', 'DD-MM-YYYY', 'MM-DD-YYYY', 'DD-MM-YY', 'YYYY-MM-DD'];

  export const YES_NO =['Yes', 'No'];

  export const FILE_ELEMENT = {          
    name: '',
    value: '',
    edit: false
  }
