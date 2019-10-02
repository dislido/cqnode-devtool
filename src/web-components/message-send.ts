import html from '../util/obj2html';

/** @todo 将message-send作为conversation-talk的子元素，而不是所有会话共用输入 */
export class HTMLMessageSendElement extends HTMLElement {
  // 3 - 50
  fontSize = 13;
  textArea: HTMLTextAreaElement;

  container: HTMLDivElement;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(html([
      ['style', {}, `
        #container {
          height: 100%;
          min-height: 111px;
          max-height: 330px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        #drag {
          height: 3px;
          cursor: ns-resize;
          border-top: #ebebeb 1px solid;
        }
        textarea {
          width: 100%;
          height: calc(100% - 8px);
          border: none;
          outline: none;
          padding: 0;
          padding-left: 5px;
          resize: none;
          box-sizing: border-box;
          font-family: sans-serif;
        }`
      ],
      ['div', { id: 'container' }, [
        ['div', { id: 'drag', $mousedown: this.handleDrag }],
        ['textarea', { $keydown: this.handleEnterSend, $wheel: this.handleScale }, [], (el: HTMLTextAreaElement) => {
          el.style.fontSize = `${this.fontSize}px`;
          this.textArea = el;
        }],
      ], (el: HTMLDivElement) => this.container = el],
    ]));
  }
  handleDrag = (ev: MouseEvent) => {
    if (ev.button !== 0) return;
    const { height } = this.container.getBoundingClientRect();
    const { clientY } = ev;
    document.documentElement.style.cursor = 'ns-resize';
    const resizeContainer = (e: MouseEvent) => {
      const dy = clientY - e.clientY;
      const newHeight = Math.max(Math.min(height + dy, 330), 111);
      this.container.style.height = `${newHeight}px`;
    };
    document.addEventListener('mousemove', resizeContainer);
    document.addEventListener('mouseup', () => {
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', resizeContainer);
    })
  }
  handleEnterSend = (ev: KeyboardEvent) => {
    if(ev.ctrlKey && ev.key === 'Enter') {
      ev.preventDefault();
      this.send();
    }
  }
  handleScale = (ev: WheelEvent) => {
    if (!ev.ctrlKey) return;
    ev.preventDefault();
    if (ev.deltaY > 0) {
      this.fontSize = Math.max(3, this.fontSize - 1);
    } else {
      this.fontSize = Math.min(50, this.fontSize + 1);
    }
    this.textArea.style.fontSize = `${this.fontSize}px`;
  }
  send() {
    if (!this.textArea.value) return;
    $currentConversation.sendMessage(this.textArea.value);
    this.textArea.value = '';
  }
}
customElements.define('message-send', HTMLMessageSendElement);