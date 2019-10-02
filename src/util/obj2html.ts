type ChildrenType = (HTMLTreeObject | string | HTMLElement)[] | string;
type AttributeType = { [attr: string]: string | EventListenerOrEventListenerObject };
interface HTMLTreeObject {
  0: string;
  1?: AttributeType;
  2?: ChildrenType;
  3?: Obj2HtmlOption | ((el: HTMLElement) => void);
}
interface Obj2HtmlOption {
  cb?: (el: HTMLElement) => void;
}

type EventName = keyof HTMLElementEventMap;

export default function obj2html(tagname: ChildrenType): HTMLElement;
export default function obj2html<T extends keyof HTMLElementTagNameMap>(
  tagname: T,
  attributes?: AttributeType,
  children?: ChildrenType,
  option?: Obj2HtmlOption | ((el: HTMLElementTagNameMap[T]) => void),
): HTMLElementTagNameMap[T];
export default function obj2html(
  tagname: string,
  attributes?: AttributeType,
  children?: ChildrenType,
  option?: Obj2HtmlOption | ((el: HTMLElement) => void),
): HTMLElement;
export default function obj2html(
  tagname: any,
  attributes: AttributeType = {},
  children: ChildrenType = [],
  option: Obj2HtmlOption | ((el: HTMLElement) => void) = {},
) {
  if (tagname instanceof Array) {
    const frag = document.createDocumentFragment();
    tagname.forEach(it => {
      if (typeof it === 'string') {
        frag.appendChild(new Text(it));
      } else if (it instanceof HTMLElement) {
        frag.appendChild(it);
      } else frag.appendChild(obj2html(it[0], it[1], it[2], it[3]));
    });
    return frag;
  }
  const el = document.createElement(tagname) as HTMLElement;
  for (const key in attributes) {
    if (key.startsWith('$')) {
      if (typeof attributes[key] === 'function') {
        el.addEventListener(key.slice(1), attributes[key] as (ev: Event) => void);
      } else {
        el.addEventListener(key.slice(1), (<EventListenerObject>attributes[key]).handleEvent as (ev: Event) => void, attributes[key] as object);
      }
    } else el.setAttribute(key, attributes[key] as string);
  }
  if (typeof children === 'string') {
    el.textContent = children;
  } else {
    el.appendChild(obj2html(children));
  }
  if (typeof option === 'function') {
    option(el);
  } else if (option.cb) { option.cb(el); }
  return el;
}
