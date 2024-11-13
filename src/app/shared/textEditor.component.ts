import { Component, Input, Output, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';

declare function require(moduleName: string): any;
const sanitizeHtml = require('sanitize-html');
declare var Squire: any;

@Component({
  selector: 'app-text-editor',
  moduleId: module.id,
  templateUrl: 'textEditor.component.html',
  styleUrls: ['./textEditor.scss']
})
export class TextEditorComponent implements AfterViewInit {

  private editor: any;
  wordCount: number;
  @ViewChild('editor') editorElement;
  content;
  @Input('content') set setContent(content) {
    this.content = content || '';
    if (this.editor) {
      this.editor.setHTML(this.content);
    }
  }

  @Input() readonly = false;
  @Input() error = false;
  @Input() description;
  @Input() prompt;
  @Input() placeholder;
  @Input() inputId;
  @Output() contentChanged = new EventEmitter<string>();
  @Output() infoChanged = new EventEmitter<any>();
  focussed = false;
  @Input('hasFocus') set setFocus(value) {
    if (this.readonly) { return; }
    if (value) {
      setTimeout(() => { this.editorElement.nativeElement.focus(); }, 50);
      this.focussed = true;
    } else {
      this.focussed = false;
    }
  }

  ngAfterViewInit() {
    if (this.readonly) { return; }

    this.editor = new Squire(this.editorElement.nativeElement);
    if (this.content) {
      this.editor.setHTML(this.content);
      if (this.focussed) {
        setTimeout(() => { this.editorElement.nativeElement.focus(); }, 50);
      }
      setTimeout(this.isEmpty.bind(this), 0);
    }


    this.editor.addEventListener('willPaste', (data) => {
      const div = document.createElement('DIV');
      div.appendChild(data.fragment.cloneNode(true));
      const dirty = div.innerHTML.replace(/&nbsp;/g, '');
      const clean = sanitizeHtml(dirty, {
        allowedTags: [ 'b', 'i', 'p', 'div', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h6', 'h6', 'strong', 'em' ],
        selfClosing: [],
        allowedAttributes: []
      });
      const cleanDiv = document.createElement('DIV');
      cleanDiv.innerHTML = clean;
      const cleanFragment = document.createDocumentFragment();
      cleanFragment.appendChild(cleanDiv);
      data.fragment = cleanFragment;
    });

    this.editor.addEventListener('focus', () => {
      this.focussed = true;
    });
    this.editor.addEventListener('blur', () => {

      if (this.isEmpty()) {
        this.contentChanged.emit('');
      } else {
        this.contentChanged.emit(this.editor.getHTML());
      }

      this.focussed = false;
    });
  }

  isEmpty() {
    if (this.readonly) { return; }
    const content = this.editor.getHTML();
    let withoutTags = content.replace(/<[^>]*>/g, ' ');
    withoutTags = withoutTags.replace(/\s+/g, ' ');
    withoutTags = withoutTags.trim();
    // const count = withoutTags.split(' ').length;
    // this.wordCount = withoutTags ? count : 0;
    // this.infoChanged.emit({wordCount: this.wordCount});
    return withoutTags === '';
  }


  bold() {
    if (this.editor.hasFormat('b')) {
      this.editor.removeBold();
    } else {
      this.editor.bold();
    }
  }

  italic() {
    if (this.editor.hasFormat('i')) {
      this.editor.removeItalic();
    } else {
      this.editor.italic();
    }
  }

  unorderedList() {
    if (this.editor.hasFormat('ul')) {
      this.editor.removeList();
    } else {
      this.editor.makeUnorderedList();
    }
  }
  orderedList() {
    if (this.editor.hasFormat('ol')) {
      this.editor.removeList();
    } else {
      this.editor.makeOrderedList();
    }
  }

  align(alignment) {
    this.editor.setTextAlignment(alignment);
  }

  underline() {
    if (this.editor.hasFormat('u')) {
      this.editor.removeUnderline();
    } else {
      this.editor.underline();
    }
  }

  makeHeading() {
    this.editor.setFontSize('2em');
  }


  action(type) {
    this.editor[type]();
  }

}
