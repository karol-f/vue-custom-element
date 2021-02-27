import { getPropsData, reactiveProps } from './props';
import { getSlots } from './slots';
import { customEmit } from './customEvent';

/**
 * Create new Vue instance if it's not already created
 * (like when opening modal and moving element around DOM)
 * @param element
 * @param Vue
 * @param componentDefinition
 * @param props
 * @param options
 * @returns {Promise} true if vue instance was created, false if instance already existed
 */
export default function createVueInstance(element, Vue, componentDefinition, props, options) {
  if (element.__vue_custom_element__) {
    return Promise.resolve(element);
  }
  const ComponentDefinition = Vue.util.extend({}, componentDefinition);
  const propsData = getPropsData(element, ComponentDefinition, props);
  const vueVersion = (Vue.version && parseInt(Vue.version.split('.')[0], 10)) || 0;

  // Auto event handling based on $emit
  function beforeCreate() { // eslint-disable-line no-inner-declarations
    this.$emit = function emit(...args) {
      customEmit(element, ...args);
      this.__proto__ && this.__proto__.$emit.call(this, ...args); // eslint-disable-line no-proto
    };
  }
  ComponentDefinition.beforeCreate = [].concat(ComponentDefinition.beforeCreate || [], beforeCreate);

  if (ComponentDefinition._compiled) { // eslint-disable-line no-underscore-dangle
    let constructorOptions = {}; // adjust vue-loader cache object if necessary - https://github.com/vuejs/vue-loader/issues/83
    const constructor = ComponentDefinition._Ctor; // eslint-disable-line no-underscore-dangle
    if (constructor) { // eslint-disable-line no-underscore-dangle
      constructorOptions = Object.keys(constructor).map(key => constructor[key])[0].options; // eslint-disable-line no-underscore-dangle
    }
    constructorOptions.beforeCreate = ComponentDefinition.beforeCreate;
  }

  let rootElement;

  if (vueVersion >= 2) {
    const elementOriginalChildren = element.cloneNode(true).childNodes; // clone hack due to IE compatibility
    // Vue 2+
    rootElement = {
      propsData,
      props: props.camelCase,
      computed: {
        reactiveProps() {
          const reactivePropsList = {};
          props.camelCase.forEach((prop) => {
            typeof this[prop] !== 'undefined' && (reactivePropsList[prop] = this[prop]);
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
          getSlots(elementOriginalChildren, createElement)
        );
      }
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

  const elementInnerHtml = vueVersion >= 2 ? '<div></div>' : `<div>${element.innerHTML}</div>`.replace(/vue-slot=/g, 'slot=');
  if (options.shadow && element.shadowRoot) {
    element.shadowRoot.innerHTML = elementInnerHtml;
    rootElement.el = element.shadowRoot.children[0];
  } else {
    element.innerHTML = elementInnerHtml;
    rootElement.el = element.children[0];
  }

  if (options.shadow && options.shadowCss && element.shadowRoot) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(options.shadowCss));

    element.shadowRoot.appendChild(style);
  }

  reactiveProps(element, props);

  if (typeof options.beforeCreateVueInstance === 'function') {
    rootElement = options.beforeCreateVueInstance(rootElement) || rootElement;
  }

  return Promise.resolve(rootElement).then((vueOpts) => {
    // Define the Vue constructor to manage the element
    element.__vue_custom_element__ = new Vue(vueOpts);
    element.__vue_custom_element_props__ = props;
    element.getVueInstance = () => {
      const vueInstance = element.__vue_custom_element__;
      return vueInstance.$children.length ? vueInstance.$children[0] : vueInstance;
    };

    element.removeAttribute('vce-cloak');
    element.setAttribute('vce-ready', '');
    customEmit(element, 'vce-ready');
    return element;
  });
}
