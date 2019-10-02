declare class HTMLConversationTalkElement extends HTMLElement {
  container: HTMLDivElement;
  /** 收到新消息是否自动滚动到最下方 */
  isScrollBottom: boolean;
  /** 记录滚动条位置，`isScrollBottom=false`时有效 */
  scrollPosition: number;
  talkTarget: {
      type: 'group' | 'private' | 'discuss';
      id: number;
  };
  constructor();
  connectedCallback(): void;
  shiftMessage(): Element | undefined;
  clearMessage(): void;
  addMessage(name: string, msg: string | CQNode.CQEvent.MessageObject[], me?: boolean, popupContent?: Element): void;
  sendMessage(msg: string): void;
}


declare class HTMLConversationListElement extends HTMLElement {
  container: HTMLDivElement;
  list: HTMLDivElement;
  value: string;
  currentConversation?: HTMLConversationTalkElement;
  conversationMap: WeakMap<HTMLElement, HTMLConversationTalkElement>;
  isHide: boolean;
  constructor();
  toggle(): void;
  addConversation(id: string, type: 'group' | 'private' | 'discuss', content: string): HTMLDivElement;
  touchConversation(id: string, type: 'group' | 'private' | 'discuss', data?: CQNode.CQEvent.Event): HTMLConversationTalkElement;
  focusConversation(conver: HTMLDivElement): void;
}

declare class HTMLMessageSendElement extends HTMLElement {
  fontSize: number;
  constructor();
}

/** 聊天内容区域 */
declare const $messageList: HTMLDivElement;
/** 左侧会话列表 */
declare const $conversationList: HTMLConversationListElement;
/** 当前打开的会话，$messageList的子元素 */
declare let $currentConversation: HTMLConversationTalkElement;
/** 消息输入框 */
declare const $messageSend: HTMLMessageSendElement;
/** 机器人对象 */
declare const $robot: CQNode.Robot;
