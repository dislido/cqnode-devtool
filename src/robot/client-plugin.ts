import { Plugin, HookData, util } from '@dislido/cqnode';
import '../web-components/pop-up';
import { createTest } from '../cqnode-test-server';

function createPopup(content: string) {
  const popup = document.createElement('pop-up');
  const popupContent = document.createElement('span');
  popupContent.setAttribute('slot', 'content');
  popupContent.textContent = content;
  popup.appendChild(popupContent);
  return popup;
}

export default class ClientPlugin extends Plugin {
  testServer: ReturnType<typeof createTest>;
  constructor() {
    super();
  }
  onReady() {
    this.testServer = createTest({
      ...this.cqnode.config.connector,
    });
  }
  onResponse(data: HookData.onResponse) {
    console.table({
      类型: '回复',
      事件类型: util.eventType.assertEventName(data.event),
      处理模块: data.handlerModule ? `${data.handlerModule.inf.name}(${data.handlerModule.inf.packageName})` : undefined,
      响应信息: '-------',
      ...data.body
    });
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
    console.table(Object.assign({
      类型: 'API调用',
      API名: data.apiName,
      调用者: `${data.caller.inf.name}(${data.caller.inf.packageName})`,
    }, data.params));
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
