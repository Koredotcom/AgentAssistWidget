export interface ParamsWidget {
    key: string;
    path: string;
}

export interface Widget {
    title: string;
    label: string;
    id?: string;
    type: 'custom' | 'system';
    url: string;
    alternativeUrl: string;
    metaInfo: {
        params: ParamsWidget []
    }
}

export interface WidgetVariables {
    id: string;
    name: string;
    mapping: string;
}

export interface FileUpload {
    fileId: string;
    hash: string;
}
