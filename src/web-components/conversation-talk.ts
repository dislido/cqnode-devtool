import './pop-up';
import html from '../util/obj2html';
import renderMsg from '../util/render-message';

function createMessage(name: string, msg: string | any[], me?: boolean, popUp?: Element) {
  const container = document.createElement('section');
  if (me) container.className = 'me';

  const message = document.createElement('pre');
  if (typeof msg === 'string') {
    message.textContent = msg;
  } else {
    if (msg.length === 1 && msg[0].type === 'image') {
      message.style.padding = '0px';
      message.style.fontSize = '0px';
    }
    msg.forEach(it => {
      if (renderMsg[it.type]) message.appendChild(renderMsg[it.type](it));
      else console.log('未识别的消息元素：', it);
    });
  }

  container.appendChild(html('p', {}, name));
  if (popUp) {
    message.setAttribute('slot', 'el');
    popUp.appendChild(message);
    container.appendChild(popUp);
  } else {
    container.appendChild(message);
  }
  return container;
}

function onComplete() {
  if (document.readyState !== 'complete') return;
  $messageList.addEventListener('scroll', () => {
    if (!$currentConversation) return;
    if ($messageList.scrollTop + $messageList.clientHeight === $messageList.scrollHeight) $currentConversation.isScrollBottom = true;
    else {
      $currentConversation.isScrollBottom = false;
      $currentConversation.scrollPosition = $messageList.scrollTop;
    }
  }, { passive: true });
  document.removeEventListener('readystatechange', onComplete);
}
document.addEventListener('readystatechange', onComplete);

export class HTMLConversationTalkElement extends HTMLElement {
  container: HTMLDivElement;
  /** 收到新消息是否自动滚动到最下方 */
  isScrollBottom = true;
  /** 记录滚动条位置，`isScrollBottom=false`时有效 */
  scrollPosition = 0;
  talkTarget: {
    type: 'group' | 'private' | 'discuss',
    id: number,
  };
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const container = this.container = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
    section {
    }
    p {
      font-size: 12px;
      margin: 5px;
      color: #7f7f7f;
    }
    pre {
      max-width: 90%;
      display: inline-block;
      position: relative;
      margin: 5px;
      padding: 11px 12px 10px;
      font-size: 13px;
      border-radius: 6px;
      background-color: #e5e5e5;
      font-family: sans-serif;
      white-space: pre-wrap;
      word-break: break-word;
    }
    pre::before {
      content: ' ';
      position: absolute;
      background: conic-gradient(from 90deg at 0% 0%, transparent 0deg 35deg, #e5e5e5 45deg 75deg, transparent 90deg);
      top: -6px;
      left: 10px;
      width: 8px;
      height: 6px;
    }
    pre img {
      border-radius: 6px;
    }
    section.me {
      text-align: right;
    }
    section.me p {
      display: none;
    }
    section.me pre {
      color: white;
      background-color: #12b7f5;
    }
    section.me pre::before {
      background: conic-gradient(from 180deg at 100% 0%, transparent 0deg, #12b7f5 15deg 45deg, transparent 55deg);
      left: unset;
      right: 10px;
    }
    img {
      max-width: 50vw;
      max-height: 50vh;
    }

    .msg-at {
      display: inline-block;
    }
    `;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(container);
  }
  connectedCallback() {
    if (this.isScrollBottom) $messageList.scrollTop = $messageList.scrollHeight;
    else $messageList.scrollTop = this.scrollPosition;
  }

  shiftMessage() {
    const msg = this.container.children[0];
    if (msg) {
      if (!this.isScrollBottom) this.scrollPosition -= msg.clientHeight;
      msg.remove();
      return msg;
    }
    return;
  }
  clearMessage() {
    [...this.container.children].forEach(it => it.remove());
    this.isScrollBottom = true;
  }
  addMessage(name: string, msg: string | CQNode.CQEvent.MessageObject[], me?: boolean, popupContent?: Element) {
    this.container.appendChild(createMessage(name, msg, me, popupContent));
    if ($messageList.scrollTop + $messageList.clientHeight === $messageList.scrollHeight) $messageList.scrollTop = $messageList.scrollHeight;
  }
  sendMessage(msg: string) {
    $robot.api.sendMsg(this.talkTarget.type, this.talkTarget.id, msg);
    this.addMessage('', msg, true);
  }
}

customElements.define('conversation-talk', HTMLConversationTalkElement);