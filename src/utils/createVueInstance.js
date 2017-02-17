import { getPropsData, reactiveProps } from './props';
import { getSlots } from './slots';

/**
 * Create new Vue instance if it's not already created
 * (like when opening modal and moving element around DOM)
 * @param element
 * @param Vue
 * @param componentDefinition
 * @param props
 * @param options
 */
export default function createVueInstance(element, Vue, componentDefinition, props, options) {
  if (!element.__vue_custom_element__) {
    const ComponentDefinition = Vue.util.extend({}, componentDefinition);
    const elementOriginalChildren = element.cloneNode(true).childNodes; // clone hack due to IE compatibility
    const propsData = getPropsData(element, ComponentDefinition, props);
    const vueVersion = (Vue.version && parseInt(Vue.version.split('.')[0], 10)) || 0;

    let rootElement;

    if (vueVersion >= 2) {
      // Vue 2+
      rootElement = {
        propsData,
        props: props.camelCase,
        store: options.store || null,
        computed: {
          reactiveProps() {
            const reactivePropsList = {};
            props.camelCase.forEach((prop) => {
              reactivePropsList[prop] = this[prop];
            });

            return reactivePropsList;
          }
        },
        /* eslint-disable */
        render(createElement) {
          const data = {
            props: this.reactiveProps
          };

          return createElement(
            ComponentDefinition,
            data,
            getSlots(elementOriginalChildren, createElement, Vue)
          );
        },
        /* eslint-enable */
      };
    } else if (vueVersion === 1) {
      // Fallback for Vue 1.x
      rootElement = ComponentDefinition;
      rootElement.propsData = propsData;
    } else {
      // Fallback for older Vue versions
      rootElement = ComponentDefinition;
      const propsWithDefault = {};
      Object.keys(propsData)
        .forEach((prop) => {
          propsWithDefault[prop] = { default: propsData[prop] };
        });
      rootElement.props = propsWithDefault;
    }

    const elementInnerHtml = vueVersion >= 2 ? '<div></div>' : `<div>${element.innerHTML}</div>`;
    if (options.shadow && element.shadowRoot) {
      element.shadowRoot.innerHTML = elementInnerHtml;
      rootElement.el = element.shadowRoot.children[0];
    } else {
      element.innerHTML = elementInnerHtml;
      rootElement.el = element.children[0];
    }

    reactiveProps(element, props);

    // Define the Vue constructor to manage the element
    element.__vue_custom_element__ = new Vue(rootElement);
    element.removeAttribute('ve-cloak');
    element.setAttribute('ve-ready', '');
  }
}
