import CQNode from '@dislido/cqnode';

let id = 0;

interface MessageObject {
  type: string;
  data: {
    [name: string]: string;
  }
}
function resolveMessage(message: MessageObject[] | string) {
  if (typeof message === 'string') return message;
  return message.reduce((p, c) => {
    if (c.type === 'text') return p + c.data;
    return p + CQNode.util.CQCode(c.type, c.data);
  }, '');
}
interface User {
  userId: 2001;
  nickname: '用户1';
  sex: 'male';
  age: 12;
}
export const config: {
  selfId: number;
  users: {
    [id: number]: User;
  };
  groups: {
    groupId: number;
    name: string;
    users: {
      userId: number;
      area: string;
      card: string;
      level: string;
      role: string;
      title: string;
    }[];
  }[];
  discusses: {
    discussId: number;
    name: string;
    users: {
      userId: number;
    }[];
  }[];
} = {
  selfId: 1001,
  users: {
    2001: {
      userId: 2001,
      nickname: '用户1',
      sex: 'male',
      age: 12,
    }
  },
  groups: [{
    groupId: 3001,
    name: '1号群',
    users: [{
      userId: 2001,
      area: '北京',
      card: '0001',
      level: '1',
      role: 'owner',
      title: '一号用户',
    }],
  }],
  discusses: [{
    discussId: 4001,
    name: '1号讨论组',
    users: [{
      userId: 2001,
    }],
  }],
}

export function createPrivateMessage({
  selfId = config.selfId,
  messageId = id++,
  userId = 1,
  message = [{ type: 'text', data: { text: '测试消息' }}],
  rawMessage = '测试消息',
  font = 0,
  sender = {},
}) {
  return {
    postType: 'message',
    time: Date.now(),
    selfId,
    messageType: 'private',
    messageId,
    userId,
    message,
    rawMessage,
    font,
    sender,
  }
}

function createEvent(postType: 'message' | 'notice' | 'request' | 'meta_event') {
  return { postType, time: Date.now(), selfId: config.selfId };
}
function messageEvent(messageType: 'group' | 'private' | 'discuss', message: string | MessageObject[], userId: number, sender: any) {
  return Object.assign(createEvent('message'), {
    messageType,
    userId,
    message,
    sender,
    messageId: id++,
    rawMessage: resolveMessage(message),
    font: 0,
  });
};
createEvent.message = messageEvent;

messageEvent.private = function(message: string | MessageObject[], subType: 'friend' | 'group' | 'discuss' | 'other' = 'friend', userId = 2001) {
  return Object.assign(messageEvent('private', message, userId, config.users[userId]), { subType });
}
messageEvent.group = function(
  message: string | MessageObject[],
  groupId = 3001,
  subType: 'normal' | 'anonymous' | 'notice' = 'normal',
  userId = 2001,
  sender = config.users[2001],
  annoymous: null | {
    id: number;
    name: string;
    flag: string;
} = null) {
  return Object.assign(messageEvent('private', message, userId, sender), { groupId, subType, annoymous });
}
messageEvent.discuss = function(message: string | MessageObject[], discussId = 4001, userId = config.users[2001].userId, sender = config.users[2001]) {
  return Object.assign(messageEvent('discuss', message, userId, sender), { discussId });
}

export default createEvent;
