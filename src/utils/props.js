import { camelize, hyphenate } from './helpers';

/**
 * Number and Boolean props are treated as strings
 * We should convert it so props will behave as intended
 * Conversion can be overwritted by prop validation (https://vuejs.org/v2/guide/components-props.html#Prop-Validation)
 * @param value
 * @param overrideType
 * @returns {*}
 */
export function convertAttributeValue(value, overrideType) {
  let propsValue = value;
  const isBoolean = ['true', 'false'].indexOf(value) > -1;
  const valueParsed = parseFloat(propsValue, 10);
  const isNumber = !isNaN(valueParsed) && isFinite(propsValue) && !propsValue.match(/^0+[^.]\d*$/g);

  if (overrideType && overrideType !== Boolean) {
    propsValue = overrideType(value);
  } else if (isBoolean || overrideType === Boolean) {
    propsValue = propsValue === 'true';
  } else if (isNumber) {
    propsValue = valueParsed;
  }

  return propsValue;
}

function extractProps(collection, props) {
  if (collection && collection.length) {
    collection.forEach((prop) => {
      const camelCaseProp = camelize(prop);
      props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);
    });
  } else if (collection && typeof collection === 'object') {
    for (const prop in collection) { // eslint-disable-line no-restricted-syntax, guard-for-in
      const camelCaseProp = camelize(prop);
      props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);

      if (collection[camelCaseProp] && collection[camelCaseProp].type) {
        props.types[prop] = [].concat(collection[camelCaseProp].type)[0];
      }
    }
  }
}

/**
 * Extract props from component definition, no matter if it's array or object
 * @param componentDefinition
 * @param Vue
 */
export function getProps(componentDefinition = {}) {
  const props = {
    camelCase: [],
    hyphenate: [],
    types: {}
  };


  if (componentDefinition.mixins) {
    componentDefinition.mixins.forEach((mixin) => {
      extractProps(mixin.props, props);
    });
  }

  if (componentDefinition.extends && componentDefinition.extends.props) {
    const { props: parentProps } = componentDefinition.extends;

    extractProps(parentProps, props);
  }

  extractProps(componentDefinition.props, props);

  props.camelCase.forEach((prop) => {
    props.hyphenate.push(hyphenate(prop));
  });

  return props;
}

/**
 * If we get DOM node of element we could use it like this:
 * document.querySelector('widget-vue1').prop1 <-- get prop
 * document.querySelector('widget-vue1').prop1 = 'new Value' <-- set prop
 * @param element
 * @param props
 */
export function reactiveProps(element, props) {
  // Handle param attributes
  props.camelCase.forEach((name, index) => {
    Object.defineProperty(element, name, {
      get() {
        return this.__vue_custom_element__[name];
      },
      set(value) {
        if ((typeof value === 'object' || typeof value === 'function') && this.__vue_custom_element__) {
          const propName = props.camelCase[index];
          this.__vue_custom_element__[propName] = value;
        } else {
          const type = props.types[props.camelCase[index]];
          this.setAttribute(props.hyphenate[index], convertAttributeValue(value, type));
        }
      }
    });
  });
}

/**
 * In root Vue instance we should initialize props as 'propsData'.
 * @param instanceOptions
 * @param componentDefinition
 * @param props
 */
export function getPropsData(element, componentDefinition, props) {
  const propsData = componentDefinition.propsData || {};

  props.hyphenate.forEach((name, index) => {
    const propCamelCase = props.camelCase[index];
    const propValue = element.attributes[name] || element[propCamelCase];

    let type = null;
    if (props.types[propCamelCase]) {
      type = props.types[propCamelCase];
    }

    propsData[propCamelCase] = propValue instanceof Attr
      ? convertAttributeValue(propValue.value, type)
      : propValue;
  });

  return propsData;
}
