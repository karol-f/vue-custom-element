import { toArray } from './helpers';

/**
 * Get attributes of given node
 * @param children
 * @param Vue
 * @returns {*}
 */
export function getAttributes(children) {
  const attributes = {};

  toArray(children.attributes).forEach((attribute) => {
    attributes[attribute.nodeName === 'vue-slot' ? 'slot' : attribute.nodeName] = attribute.nodeValue;
  });

  return attributes;
}

/**
 * Get childNodes of an element
 * @param {HTMLElement} element
 * @returns {NodeList}
 */
export function getChildNodes(element) {
  if (element.childNodes.length > 0) return element.childNodes;
  if (element.content && element.content.childNodes && element.content.childNodes.length > 0) {
    return element.content.childNodes;
  }

  const placeholder = document.createElement('div');

  placeholder.innerHTML = element.innerHTML;

  return placeholder.childNodes;
}

/**
 * Helper utility returning slots for render function
 * @param children
 * @param createElement
 * @param Vue
 */
export function getSlots(children = [], createElement) {
  const slots = [];
  toArray(children).forEach((child) => {
    if (child.nodeName === '#text') {
      if (child.nodeValue.trim()) {
        slots.push(createElement('span', child.nodeValue));
      }
    } else if (child.nodeName !== '#comment') {
      const attributes = getAttributes(child);
      const elementOptions = {
        attrs: attributes,
        domProps: {
          innerHTML: (child.innerHTML === '' ? child.innerText : child.innerHTML)
        }
      };

      if (attributes.slot) {
        elementOptions.slot = attributes.slot;
        attributes.slot = undefined;
      }

      if (child.tagName === 'TEMPLATE') {
        const templateChildren = getChildNodes(child);

        const vueTemplateChildren = toArray(templateChildren).map((ch) => {
          // children passed to create element can be a string
          // https://vuejs.org/v2/guide/render-function#createElement-Arguments
          if (ch.nodeName === '#text') return ch.nodeValue;

          return createElement(ch.tagName, {
            attrs: getAttributes(ch),
            domProps: {
              innerHTML: ch.innerHTML
            }
          });
        });

        elementOptions.slot = child.id;

        slots.push(createElement('template', elementOptions, vueTemplateChildren));
      } else {
        slots.push(createElement(child.tagName, elementOptions));
      }
    }
  });

  return slots;
}
