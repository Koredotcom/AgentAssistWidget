
import * as ace from 'brace';

export interface CompletionModel {
    caption: string;
    description?: string;
    snippet?: string;
    meta: string;
    type: string;
    value?: string;
    parent?: string;
    docHTML?: string;
    inputParameters?: { [name: string]: string };
}


export interface ICompleter {

    getCompletions(
        editor: ace.Editor,
        session: ace.IEditSession,
        pos: ace.Position,
        prefix: string,
        callback: (data: any | null, completions: CompletionModel[]) => void
    ): void;

    getDocTooltip(item: CompletionModel): void;
}

export interface MetaInfoModel {
    Name: string;
    Description: string;
    Type: string;
    Children: MetaInfoModel[];
    InputParameters?: { [name: string]: string };
}
