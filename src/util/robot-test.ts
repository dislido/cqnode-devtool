const rob = $robot;
rob.emit('GroupMessage', {
  message: [{type:'text',data:'aaa'}],
  rawMessage: 'aaa',
  userId: 5114,
  messageType: 'group',
  subType: 'normal',
  /** 群号 */
  groupId: 114,
  /** 匿名信息，如果不是匿名消息则为 null */
  anonymous: null,
  /** 发送人信息,不保证各字段存在和正确性 */
  sender: {
    /** 发送者QQ号 */
    userId: 5114,
    /** 年龄 */
    age: 14,
    /** 地区 */
    area: '',
    /** 群名片／备注 */
    card: 'aaa',
    /** 成员等级 */
    level: 1,
    /** 昵称 */
    nickname: 'sss',
    /** 角色
     * owner: 群主
     * admin: 管理员
     * member: 群成员
     */
    role: 'member',
    /** 性别 */
    sex: 'male',
    /** 专属头衔 */
    title: 'aaa',
  },
});