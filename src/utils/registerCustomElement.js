import 'set-prototype-of'; // polyfill for older browsers (IE < 11) that do not support Object.setPrototypeOf needed by Webpack's transpiled ES2015 "class", even if it's not directly used
import isES2015 from './isES2015';

export default function registerCustomElement(tag, options = {}) {
  if (typeof customElements === 'undefined') { return; } // eslint-disable-line

  function constructorCallback() {
    if (options.shadow === true && HTMLElement.prototype.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }
    typeof options.constructorCallback === 'function' && options.constructorCallback.call(this);
  }
  function connectedCallback() {
    typeof options.connectedCallback === 'function' && options.connectedCallback.call(this);
  }

  function disconnectedCallback() {
    typeof options.disconnectedCallback === 'function' && options.disconnectedCallback.call(this);
  }

  function attributeChangedCallback(name, oldValue, value) {
    typeof options.attributeChangedCallback === 'function' && options.attributeChangedCallback.call(this, name, oldValue, value);
  }

  function define(_tag, _CustomElement) {
    const existingCustomElement = customElements.get(_tag);
    return typeof existingCustomElement !== 'undefined' ? existingCustomElement : customElements.define(_tag, _CustomElement);
  }

  if (isES2015) {
    // ES2015 detected. We will use "class" based Custom Elements V1 specification.
    // If it's natively supported it will run without polyfill
    class CustomElement extends HTMLElement {
      // Can define constructor arguments if you wish.
      constructor(self) {
        super();

        const me = self ? HTMLElement.call(self) : this;

        constructorCallback.call(me);
        return me;
      }

      static get observedAttributes() {
        return options.observedAttributes || [];
      }
    }

    CustomElement.prototype.connectedCallback = connectedCallback;
    CustomElement.prototype.disconnectedCallback = disconnectedCallback;
    CustomElement.prototype.attributeChangedCallback = attributeChangedCallback;

    define(tag, CustomElement);
    return CustomElement; // eslint-disable-line consistent-return
  } else { // eslint-disable-line no-else-return
    // not ES2015. We will use polyfill supported version of registering Custom Elements
    // so older browsers could handle it
    function CustomElement(self) { // eslint-disable-line no-inner-declarations
      const me = self ? HTMLElement.call(self) : this;

      constructorCallback.call(me);
      return me;
    }

    CustomElement.observedAttributes = options.observedAttributes || [];

    CustomElement.prototype = Object.create(
      HTMLElement.prototype, {
        constructor: {
          configurable: true,
          writable: true,
          value: CustomElement
        }
      }
    );

    CustomElement.prototype.connectedCallback = connectedCallback;
    CustomElement.prototype.disconnectedCallback = disconnectedCallback;
    CustomElement.prototype.attributeChangedCallback = attributeChangedCallback;

    define(tag, CustomElement);
    return CustomElement; // eslint-disable-line consistent-return
  }
}
