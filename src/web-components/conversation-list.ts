import './conversation-talk';
import { HTMLConversationTalkElement } from './conversation-talk';
import { CQEvent } from '@dislido/cqnode';
import html from '../util/obj2html';

function createConversation(id: string, type: string, content: string) {
  id = `conversation-${type}-${id}`;
  const handleLabelClick = (ev: MouseEvent) => {
    $conversationList.value = id;
    if (ev.button !== 0) return;
    document.title = content;
    const cl = $conversationList;
    const converwnd = cl.conversationMap.get(container)!;
    if (cl.currentConversation === converwnd) return;
    if (cl.currentConversation) {
      cl.currentConversation.remove();
    } else {
      document.querySelector('main')!.className = '';
    }
    cl.currentConversation = converwnd;
    $messageList.appendChild(converwnd);
    Reflect.set(window, '$currentConversation', converwnd);
  };
  const container = html('div', { class: 'conversation-item' }, [
    ['input', { type: 'radio', name: 'conversation-item', id }],
    ['label', { for: id, $click: handleLabelClick }, content],
  ]);
  return container;
}

// #conversation-list
export class HTMLConversationListElement extends HTMLElement {
  container: HTMLDivElement;
  list: HTMLDivElement;

  value = '';
  currentConversation?: HTMLConversationTalkElement;
  conversationMap: WeakMap<HTMLElement, HTMLConversationTalkElement> = new WeakMap();
  isHide = false;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(html([
      ['style', {}, `
        #container {
          display: flex;
          height: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
          min-width: 63px;
          max-width: 246px;
        }
        #container::-webkit-scrollbar {
          display:none
        }

        #list {
          flex-grow: 1;
          max-width: calc(100% - 3px);
          -webkit-app-region: drag;
        }
        #drag {
          width: 3px;
          cursor: ew-resize;
          border-left: #ebebeb 1px solid;
        }

        .conversation-item {
          height: 60px;
          width: 100%;
          overflow: hidden;
          -webkit-app-region: no-drag;
        }
        .conversation-item label {
          display: block;
          height: 100%;
          width: 100%;
          border-left: transparent solid 3px;
          word-break: break-all;
        }
        .conversation-item input {
          display: none;
        }
        .conversation-item input:checked + label {
          background-color: #ebebeb;
          border-left-color: black;
        }
        .conversation-item label:hover {
          background-color: #f2f2f2;
        }
      `],
      ['div', { id: 'container' }, [
        ['div', { id: 'list' }, [], (list: HTMLDivElement) => this.list = list],
        ['div', { id: 'drag', $mousedown: this.handleDrag }],
      ], (it: HTMLDivElement) => {
        it.style.width = '63px';
        this.container = it;
      }],
    ]));
  }
  handleDrag = (ev: MouseEvent) => {
    if (ev.button !== 0) return;
    const { width } = this.container.getBoundingClientRect();
    const { clientX } = ev;
    document.documentElement.style.cursor = 'ew-resize';
    const resizeContainer = (e: MouseEvent) => {
      const dx = e.clientX - clientX;
      const newWidth = Math.max(Math.min(width + dx, 246), 63);
      this.container.style.width = `${newWidth}px`;
    };
    document.addEventListener('mousemove', resizeContainer);
    document.addEventListener('mouseup', () => {
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', resizeContainer);
    });
  };
  toggle() {
    this.container.style.display = this.isHide ? 'none' : null;
  }
  addConversation(id: string, type: 'group' | 'private' | 'discuss', content: string) {
    const conver = createConversation(id, type, content);
    const talk = html('conversation-talk') as HTMLConversationTalkElement;
    talk.talkTarget = { type, id: parseInt(id) };
    this.conversationMap.set(conver, talk);
    this.list.appendChild(conver);
    return conver;
  }
  /** 获取会话窗口，若无此会话，则创建会话 */
  touchConversation(id: string, type: 'group' | 'private' | 'discuss', data?: CQEvent.Event | string) {
    let conver = this.list.querySelector<HTMLDivElement>(`#conversation-${type}-${id}`);
    if (!conver) {
      if (typeof data === 'string') {
        conver = this.addConversation(id, type, data);
      } if (type === 'group') {
        const group = $robot.inf.groupList.find(it => it.group_id === parseInt(id));
        conver = this.addConversation(id, type, group ? group.group_name : `群${id}`);
      } else if (type === 'private') {
        conver = this.addConversation(id, type, (<CQEvent.PrivateMessage>data).username);
      } else conver = this.addConversation(id, type, `会话${type}${id}`);
    } else {
      conver = conver.parentElement as HTMLDivElement;
    }
    if (!this.currentConversation) this.focusConversation(conver);
    return this.conversationMap.get(conver)!;
  }
  focusConversation(conver: HTMLDivElement) {
    conver.querySelector('label')!.click();
  }
  closeConversation(id = this.value) {
    const converRadio = this.list.querySelector(`#${id}`);
    if (!converRadio) return;
    const conver = converRadio.parentElement as HTMLDivElement;
    conver.remove();
    this.conversationMap.get(conver)!.remove();
    if (this.list.children.length === 0) {
      document.querySelector('main')!.className = 'noConversation';
      this.currentConversation = undefined;
      this.value = '';
      document.title = '';
      this.conversationMap.delete(conver);
    } else {
      this.focusConversation(this.list.children[0] as HTMLDivElement);
    }
  }
}

customElements.define('conversation-list', HTMLConversationListElement);
