import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CompleterService } from './completer.service';
import { MetaInfoModel } from './completer.model';

import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/ext/language_tools';
import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import { convertToContextVars } from 'src/app/helpers/utils';
@Component({
  selector: 'app-js-editor',
  templateUrl: './js-editor.component.html',
  styleUrls: ['./js-editor.component.scss']
})
export class JsEditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  metaInfo: MetaInfoModel[] = [];
  @Input() script = '';
  options = {
    printMargin: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
  };
  emitVal;
  @ViewChild('editor', { static: true })
  editor: any;

  @Output() textChanged = new EventEmitter();

  constructor(private completer: CompleterService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.completer.setMetadata(convertToContextVars(this.metaInfo));
  }

  ngAfterViewInit() {
    const langTools = ace.acequire('ace/ext/language_tools');

    langTools.setCompleters([this.completer]);

    this.editor._editor.commands.on("afterExec", (e) => {
      if (e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) {
        this.editor._editor.execCommand("startAutocomplete");
      }
    });

    // editor.on('blur', () => { this._onTouched() });
    // this.textChanged.next(editor);

    this.editor._editor.on("blur", (e) => {
      this.emitVal = this.script;
      this.textChanged.emit(this.emitVal)
    });

  }

  ngOnDestroy(): void {
    const langTools = ace.acequire('ace/ext/language_tools');
    const { textCompleter, keyWordCompleter, snippetCompleter } = langTools;
    langTools.setCompleters([
      textCompleter,
      keyWordCompleter,
      snippetCompleter
    ]);
  }

  getEditor(): ace.Editor {
    return this.editor._editor;
  }

}

