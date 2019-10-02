# cqnode-qqclient
基于electron + 酷Q + CQNode的qq客户端，开发中

# 已完成内容
- 群聊/私聊
- 图片/文本 消息接收
- 文本消息发送
- CQNode模块支持
- 感知CQNode模块发送的文本消息

默认的酷Q HTTP API配置文件内容（`post_message_format`为`"array"`才能接收图片信息）
```json
{
  "general": {
    "port": 5700,
    "post_url": "http://127.0.0.1:8080",
    "post_timeout": 1000,
    "disable_coolq_log": false,
    "enable_heartbeat": false,
    "heartbeat_interval": 15000,
    "show_log_console": false,
    "post_message_format": "array"
  }
}
```

# 配置文件
在本文件夹中创建`cqnode.config.js`文件,导出配置对象 例如：
```javascript
const CQNode = require('@dislido/cqnode');

class TestModule extends CQNode.Module {
  constructor() {
    super({
      name: '测试模块',
      packageName: 'test-module',
      help: '无',
      description: '无',
    })
  }
  /**
   * 
   * @param {CQNode.CQEvent.GroupMessage} data 
   * @param {CQNode.CQResponse.GroupMessage} resp 
   */
  onGroupMessage(data, resp) {
    console.log(data);
    setTimeout(() => this.cqnode.api.sendGroupMsg(data.groupId, 'test send'), 3000);
    return resp.reply(`received: ${data.msg}`);
  }
}

module.exports = {
  modules: [new TestModule()],
  plugins: [],
};

```

# todo
- 完成所有酷Q&HTTP API&CQNode支持的功能  
- 将某些功能相近的组件整合为一个组件  
- webComponent的样式使用css变量以便外部修改
- 滚动条样式

# 已知bug
- Menubar无法删除，考虑在html中实现
  - https://github.com/electron/electron/issues/16521
- 最大化按钮实际上只是把窗口宽高调到最大，可能因此会出现一些不正确的行为
  - https://github.com/electron/electron/issues/19934
  - https://github.com/electron/electron/issues/12854
- 不支持透明菜单，考虑在html中实现
