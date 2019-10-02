import { Plugin, HookData, util } from '@dislido/cqnode';
import '../web-components/pop-up';

function createPopup(content: string) {
  const popup = document.createElement('pop-up');
  const popupContent = document.createElement('span');
  popupContent.setAttribute('slot', 'content');
  popupContent.textContent = content;
  popup.appendChild(popupContent);
  return popup;
}

export default class ClientPlugin extends Plugin {
  constructor() {
    super();
  }
  onResponse(data: HookData.onResponse) {
    if (!data.handlerModule) return true;
    if (util.eventType.isGroupMessage(data.event)) {
      let msg = data.body.reply;
      if (!data.body.at || data.body.at !== false) {
        msg = `@${data.event.username} ${msg}`
      }
      const converTalk = $conversationList.touchConversation(`${data.event.groupId}`, 'group', data.event);
      const popupContent = createPopup(`本消息由模块: ${data.handlerModule!.inf.name} 发送`);
      if (data.body.reply) converTalk.addMessage('', msg, true, popupContent);
    } else if (util.eventType.isPrivateMessage(data.event)) {
      const converTalk = $conversationList.touchConversation(`${data.event.userId}`, 'private', data.event);
      const popupContent = createPopup(`本消息由模块: ${data.handlerModule!.inf.name} 发送`);
      if (data.body.reply) converTalk.addMessage('', data.body.reply, true, popupContent);
    }
    return true;
  }
  onRequestAPI(data: HookData.onRequestAPI) {
    if (data.apiName === 'sendGroupMsg') {
      const [id, msg] = data.params;
      const popupContent = createPopup(`本消息由模块: ${data.caller.inf.name} 发送`);
      const converTalk = $conversationList.touchConversation(`${id}`, 'group');
      converTalk.addMessage('', msg as string, true, popupContent);
    }
    if (data.apiName === 'sendPrivateMsg') {
      const [id, msg] = data.params;
      const popupContent = createPopup(`本消息由模块: ${data.caller.inf.name} 发送`);
      const converTalk = $conversationList.touchConversation(`${id}`, 'private');
      converTalk.addMessage('', msg as string, true, popupContent);
    }
    return true;
  }
}
