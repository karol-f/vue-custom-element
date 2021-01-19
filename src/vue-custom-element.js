import registerCustomElement from './utils/registerCustomElement';
import createVueInstance from './utils/createVueInstance';
import { getProps, convertAttributeValue } from './utils/props';
import { camelize } from './utils/helpers';

function install(Vue) {
  Vue.customElement = function vueCustomElement(tag, componentDefinition, options = {}) {
    const isAsyncComponent = typeof componentDefinition === 'function';
    const optionsProps = isAsyncComponent && { props: options.props || [] };
    const props = getProps(isAsyncComponent ? optionsProps : componentDefinition);
    // register Custom Element
    const CustomElement = registerCustomElement(tag, {
      constructorCallback() {
        typeof options.constructorCallback === 'function' && options.constructorCallback.call(this);
      },

      connectedCallback() {
        const asyncComponentPromise = isAsyncComponent && componentDefinition();
        const isAsyncComponentPromise = asyncComponentPromise && asyncComponentPromise.then && typeof asyncComponentPromise.then === 'function';

        typeof options.connectedCallback === 'function' && options.connectedCallback.call(this);

        if (isAsyncComponent && !isAsyncComponentPromise) {
          throw new Error(`Async component ${tag} do not returns Promise`);
        }
        if (!this.__detached__) {
          if (isAsyncComponentPromise) {
            asyncComponentPromise.then((lazyComponent) => {
              const lazyProps = getProps(lazyComponent);
              createVueInstance(this, Vue, lazyComponent, lazyProps, options).then(() => {
                typeof options.vueInstanceCreatedCallback === 'function' && options.vueInstanceCreatedCallback.call(this);
              });
            });
          } else {
            createVueInstance(this, Vue, componentDefinition, props, options).then(() => {
              typeof options.vueInstanceCreatedCallback === 'function' && options.vueInstanceCreatedCallback.call(this);
            });
          }
        }

        this.__detached__ = false;
      },

      /**
       *  When using element in e.g. modal, it's detached and then attached back to document.
       *  It will be unfortunate if we will destroy Vue instance when it happens.
       *  That's why we detect if it's permament using setTimeout
       */
      disconnectedCallback() {
        this.__detached__ = true;
        typeof options.disconnectedCallback === 'function' && options.disconnectedCallback.call(this);

        options.destroyTimeout !== null && setTimeout(() => {
          if (this.__detached__ && this.__vue_custom_element__) {
            this.__detached__ = false;
            this.__vue_custom_element__.$destroy(true);
            delete this.__vue_custom_element__;
            delete this.__vue_custom_element_props__;
          }
        }, options.destroyTimeout || 3000);
      },

      /**
       * When attribute changes we should update Vue instance
       * @param name
       * @param oldVal
       * @param value
       */
      attributeChangedCallback(name, oldValue, value) {
        if (this.__vue_custom_element__ && typeof value !== 'undefined') {
          const nameCamelCase = camelize(name);
          typeof options.attributeChangedCallback === 'function' && options.attributeChangedCallback.call(this, name, oldValue, value);
          const type = this.__vue_custom_element_props__.types[nameCamelCase];
          this.__vue_custom_element__[nameCamelCase] = convertAttributeValue(value, type);
        }
      },

      observedAttributes: props.hyphenate,

      shadow: !!options.shadow && !!HTMLElement.prototype.attachShadow
    });

    return CustomElement;
  };
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
  if (install.installed) {
    install.installed = false;
  }
}
