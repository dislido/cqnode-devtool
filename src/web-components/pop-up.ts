import html from '../util/obj2html';

export class HTMLPopUpElement extends HTMLElement {
  contentSlot: HTMLSlotElement;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(html([
      ['style', {}, `
        #container {
          position: relative;
          display: inline-block;
        }
        #container:hover {
          background: #0000003f;
        }
        slot[name="content"] {
          display: none;
          border: #0000007f 1px solid;
          background: #0000003f;
          position: fixed;
          z-index: 1;
          padding: 16px;
          max-width: 250px;
        }
        #container:hover slot[name="content"] {
          display: block;
        }`
      ],
      ['div', { id: 'container', $mousemove: this.handleMouseMove }, [
        ['slot', { name: 'el' }],
        ['slot', { name: 'content' }, [], (el: HTMLSlotElement) => this.contentSlot = el],
      ]],
    ]));
  }
  handleMouseMove = (ev: MouseEvent) => {
    const { clientX, clientY } = ev;
    this.contentSlot.style.left = `${Math.min(clientX, document.documentElement.clientWidth - 260)}px`;
    this.contentSlot.style.top = `${clientY + 30}px`;
  }
}

customElements.define('pop-up', HTMLPopUpElement);