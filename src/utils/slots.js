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
 * Get Vue element representing a template for use with slots
 * @param {Function} createVueElement - createElement function from vm
 * @param {HTMLElement} element - template element
 * @param {Object} elementOptions
 * @returns {VNode}
 */
export function templateElement(createVueElement, element, elementOptions) {
  const templateChildren = getChildNodes(element);

  const vueTemplateChildren = toArray(templateChildren).map((child) => {
    // children passed to create element can be a string
    // https://vuejs.org/v2/guide/render-function#createElement-Arguments
    if (child.nodeName === '#text') return child.nodeValue;

    return createVueElement(child.tagName, {
      attrs: getAttributes(child),
      domProps: {
        innerHTML: child.innerHTML
      }
    });
  });

  elementOptions.slot = element.id;

  return createVueElement('template', elementOptions, vueTemplateChildren);
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

      const slotVueElement = (child.tagName === 'TEMPLATE') ?
        templateElement(createElement, child, elementOptions) :
        createElement(child.tagName, elementOptions);

      slots.push(slotVueElement);
    }
  });

  return slots;
}
