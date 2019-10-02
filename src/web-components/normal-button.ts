import html from '../util/obj2html';

customElements.define('normal-button', class extends HTMLElement {
  btn: HTMLButtonElement;
  get addEventListener() { return this.btn.addEventListener.bind(this.btn); }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(html([
      ['style', , `
      button {
        margin-right: 14px;
        border: #cdcfd0 1px solid;
        padding: 0 16px;
        color: var(--color, black);
        background-color: var(--bg-color, white);
        font-size: 12px;
        line-height: 26px;
        border-radius: 2px;
        outline: none;
        -webkit-app-region: no-drag;
      }
      :host([type="send"]) button {
        border: none;
        line-height: 28px;
  
        --color: white;
        --bg-color: black;
        --hover-color: #94938f;
        --active-color: #72706b;
      }
      button:hover {
        background-color: var(--hover-color, #efeff0);
      }
      button:active {
        background-color: var(--active-color, #e1e2e3);
      }`],
      ['button', {}, [
        ['slot', { name: 'text' }],
      ], (btn: HTMLButtonElement) => this.btn = btn],
    ]));
  }
});
