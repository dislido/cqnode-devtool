import { remote } from 'electron';
import html from '../util/obj2html';

customElements.define('close-button', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(html([
      ['style', {}, `
        button {
          height: 33px;
          width: 32px;
          background: black;
          padding: 0;
          border: none;
          border-radius: 0 3px 3px 3px;
          outline: none;
          font-size: 26px;
          transition: background-color 0.5s cubic-bezier(0.18, 0.8, 0.58, 1);
          -webkit-app-region: no-drag;
        }
        button:hover {
          background: #ff5439;
        }
        button:active {
          background: #e04a32;
          transition: none;
        }
      `],
      ['button', { title: '关闭', $click() { remote.getCurrentWindow().close(); } }, [
        ['slot', { name: 'content' }],
      ]],
    ]));
  }
});