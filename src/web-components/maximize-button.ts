import { remote } from 'electron';
import html from '../util/obj2html';

customElements.define('maximize-button', class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(html('style', {}, `
    button {
      height: 33px;
      width: 31px;
      background: black;
      padding: 0;
      border: none;
      border-radius: 0 0 3px 3px;
      outline: none;
      font-size: 26px;
      transition: background-color 0.5s cubic-bezier(0.18, 0.8, 0.58, 1);
      -webkit-app-region: no-drag;
    }
    button:hover {
      background: #393836;
    }
    button:active {
      background: #5b5a59;
      transition: none;
    }
    button > slot {
      display: none;
    }
    button.maximize [name="maximize"] {
      display: inline;
    }
    button.unmaximize [name="unmaximize"] {
      display: inline;
    }`));
    
    shadowRoot.appendChild(html('button', { class: 'maximize', title: '最大化' }, [
      ['slot', { name: 'maximize' }],
      ['slot', { name: 'unmaximize' }],
    ], btn => {
      btn.addEventListener('click', () => {
        if (btn.className === 'maximize') {
          remote.getCurrentWindow().maximize();
          btn.className = 'unmaximize';
          btn.setAttribute('title', '还原');
        } else {
          remote.getCurrentWindow().unmaximize();
          btn.className = 'maximize';
          btn.setAttribute('title', '最大化');
        } 
      });
    }));
  }
});