import registerCustomElement from './utils/registerCustomElement';
import createVueInstance from './utils/createVueInstance';
import { getProps, convertAttributeValue } from './utils/props';
import { camelize } from './utils/helpers';
import isES2015 from './utils/isES2015';

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

        if (isAsyncComponent && !isAsyncComponentPromise) {
          throw new Error(`Async component ${tag} do not returns Promise`);
        }
        if (!this.__detached__) {
          if (isAsyncComponentPromise) {
            asyncComponentPromise.then((lazyLoadedComponent) => {
              const lazyLoadedComponentProps = getProps(lazyLoadedComponent);
              createVueInstance(this, Vue, lazyLoadedComponent, lazyLoadedComponentProps, options);
            });
          } else {
            createVueInstance(this, Vue, componentDefinition, props, options);
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

        setTimeout(() => {
          if (this.__detached__ && this.__vue_custom_element__) {
            this.__vue_custom_element__.$destroy(true);
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
          this.__vue_custom_element__[nameCamelCase] = convertAttributeValue(value);
        }
      },

      observedAttributes: props.hyphenate,

      shadow: !!options.shadow && !!HTMLElement.prototype.attachShadow
    });

    return CustomElement;
  };
}

export default install;

if (typeof window !== 'undefined' && window.Vue && !isES2015) {
  window.Vue.use(install);
}
