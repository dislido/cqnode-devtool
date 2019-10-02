import html from './obj2html';

export default {
  text(it) {
    return html('span', {}, it.data.text)
  },
  image(it) {
    /** @todo qq对展示图片尺寸的限制规则待研究，暂且设为50vw/50vh */
    return html('img', { src: it.data.url });
  },
  at(it) {
    /** @todo 获取名称 */
    return html('span', { class: 'msg-at' }, `@${it.data.qq}`);
  },
} as {
  [type: string]: (data: CQNode.CQEvent.MessageObject) => HTMLElement;
};