import './open-conversation-model';
import { HTMLOpenConversationModelElement } from './open-conversation-model';
import html from '../util/obj2html';

customElements.define('open-conversation', class extends HTMLElement {
  model: HTMLOpenConversationModelElement;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(html('style', {}, `
    button {
      height: 24px;
      width: 24px;
      background: black;
      padding: 0;
      border: none;
      border-radius: 4px;
      outline: none;
      -webkit-app-region: no-drag;
    }
    button:hover {
      background: #393836;
    }
    button:active {
      background: #5b5a59;
    }
    `));

    shadowRoot.appendChild(html('button', { title: '打开会话', $click: () => this.openModel() }, [
      ['slot', { name: 'content' }],
    ]));

    this.model = document.createElement('open-conversation-model') as HTMLOpenConversationModelElement;
    this.model.addEventListener('close', (ev: CustomEvent) => {
      if (ev.detail) {
        const { type, number, name } = ev.detail;
        $conversationList.touchConversation(number, type, name);
      }
      this.closeModel();
    });
  }
  openModel() {
    if (this.model.isConnected) return;
    document.body.appendChild(this.model);
  }
  closeModel() {
    if (!this.model.isConnected) return;
    this.model.remove();
  }
});
