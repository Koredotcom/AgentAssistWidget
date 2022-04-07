export interface FormField {
    _id: string;
    name: string;
    displayName: string;
    type: string;
    helpText?: string;
    dataType: string;
    placeholder?: string;
    isOptional: boolean;
    isRequired?: boolean;
    isMultiSelect?: boolean;

    dFormat?: string;
    dTFormat?: string;

    defaultOption?: number;
    dOptions?: { name: string, value: string }[]

    endPointUrl?: string;
    endPointContType?: string;
    endPointMethod?: string;
    responsePath?: string;
    labelKey?: string;
    optValKey?: string;

    fileOptions?: { name: string, value: string }[];
    allowMultipleFiles?: boolean;

}

export interface ManageFormDetails {
    fieldName: string;
    dataType: string;
    fieldType: string;
    isOptional: string;
    isMultiSelect: string;
    operation: string;
    fieldIndex: number;
}