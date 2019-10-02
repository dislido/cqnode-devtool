import { Module } from '@dislido/cqnode';

export default class ClientModule extends Module {
  constructor() {
    super();
  }

  onGroupMessage(data: CQNode.CQEvent.GroupMessage) {
    const converWnd = $conversationList.touchConversation(`${data.groupId}`, 'group', data);
    converWnd.addMessage(data.username, data.message);
    return false;
  }
  onPrivateMessage(data: CQNode.CQEvent.PrivateMessage) {
    const converWnd = $conversationList.touchConversation(`${data.userId}`, 'private', data);
    converWnd.addMessage(data.username, data.message);
  }
}
