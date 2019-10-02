import './normal-button';
import html from '../util/obj2html';

export class HTMLOpenConversationModelElement extends HTMLElement {
  inner: HTMLDivElement;
  type: string;
  number: string;
  name: string;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(html([
      ['style', {}, `
        :host {
          -webkit-app-region: no-drag;
          display: flex;
          position: absolute;
          top: 40px;
          left: 40px;
          width: 275px;
          height: 170px;
          background: #ffffffe8;
          color: black;
          z-index: 1;
          border-radius: 3px;
          box-shadow: #0005 0px 0px 7px;
          flex-direction: column;
        }
        label {
          display: block;
          margin-bottom: 4px;
        }
        select, input {
          font-size: 13px;
          padding: 0.2em 0.2em 0.4em 0.2em;
          border-radius: 3px;
          box-sizing: border-box;
          width: 175px;
        }
        input {
          border-style: solid;
          border-width: 1px;
          border-color: #a9a9a9;
        }
        #model-inner {
          flex-grow: 1;
          padding: 24px 24px 8px 24px;
        }
        #footer {
          height: 46px;
          text-align: center;
        }
        ul {
          list-style-type: none;
          padding-inline-start: 0px;
          margin-block-start: 0.5em;
        }
        li {
          padding: 0.5em 0 0.5em 0.5em;
        }
        li:hover {
          background-color: #f2f2f2;
        }`],
        ['div', { id: 'model-inner' }, [
          ['div', , [
            ['label', , [
              '类型：',
              ['select', { $change: ({ target }: Event & { target: HTMLSelectElement }) => this.type = target.value }, [
                ['option', { value: 'group' }, '群聊'],
                ['option', { value: 'private' }, '私聊'],
                ['option', { value: 'discuss' }, '讨论组'],
              ]],
            ]],
            ['label', , [
              '号码：',
              ['input', { $change: ({ target }: Event & { target: HTMLInputElement }) => this.number = target.value }],
            ]],
            ['label', , [
              '名称：',
              ['input', { $change: ({ target }: Event & { target: HTMLInputElement }) => this.name = target.value }],
            ]],
          ]],
        ], (el: HTMLDivElement) => { this.inner = el; }],
        ['div', { id: 'footer' }, [
          ['normal-button', { $click: () => this.dispatchEvent(new CustomEvent('close', { detail: { type: this.type, number: this.number, name: this.name } })) }, [
            ['span', { slot: 'text' }, '添加'],
          ]],
          ['normal-button', { $click: () => this.dispatchEvent(new CustomEvent('close')) }, [
            ['span', { slot: 'text' }, '关闭'],
          ]],
        ]]
      ]));
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
}
customElements.define('open-conversation-model', HTMLOpenConversationModelElement);
