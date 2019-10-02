import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';
import CQNode from '@dislido/cqnode';
import ClientModule from './robot/client-module';
import ClientPlugin from './robot/client-plugin';

Object.assign(window, {
  $messageList: document.getElementById('message-list'),
  $conversationList: document.getElementById('conversation-list'),
  $messageSend: document.getElementById('message-send'),
});

{
  const htmlEl = document.documentElement;

  htmlEl.addEventListener('keydown', (ev) => {
    if (ev.key === 'F12') remote.getCurrentWebContents().openDevTools({ mode: 'detach' });
    if (ev.key === 'F11') ev.preventDefault();;
  }); 

  let title = '';
  Reflect.defineProperty(document, 'title', {
    get() { return title; },
    set(v) {
      title = `${v}`;
      let titleEl = document.head.getElementsByTagName('title')[0];
      if (!titleEl) {
        titleEl = document.createElement('title');
        document.head.appendChild(titleEl);
      }
      titleEl.textContent = title;
      document.getElementById('title')!.textContent = title;
    }
  });

  const configPath = path.resolve(process.cwd(), 'cqnode.config.js');
  let config: any;
  let robot: CQNode.Robot;
  if (fs.existsSync(configPath)) {
    config = require(configPath);
    if (typeof config === 'string') {
      config = require(config);
    }
    if (!config.modules) config.modules = [];
    if (!config.plugins) config.plugins = [];
    config.modules.unshift(new ClientModule());
    config.plugins.unshift(new ClientPlugin());
    robot = CQNode.createRobot(config);
  } else {
    robot = CQNode.createRobot({
      admin: [],
      modules: [new ClientModule()],
      plugins: [new ClientPlugin()],
      connector: {
        LISTEN_PORT: 8080,
        API_PORT: 5700,
        TIMEOUT: 10000,
      },
    })
  }

  Reflect.set(window, '$robot', robot);
}