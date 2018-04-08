<template>
  <div>
    <h2>Binding and nesting demo</h2>

    <div class="demo-card">
      <demo-binding></demo-binding>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="Description" name="1">
        <p>We can access underlying Vue component using it's props by using custom element's HTML attributes (e.g. just by changing it using browser's console) or in JavaScript (example below).</p>
        <p>
          As our custom element is just HTML tag with API exposed via HTML and JavaScript, we can easily use it in Vue, React, Angular or plain JavaScript projects.
        </p>
        <p>
          It's easy to nest elements. In this example we've used <code>&#x3C;demo-basic&#x3E;</code> component created in previous example, inside a newly created <code>&#x3C;demo-binding&#x3E;</code> one.
        </p>
      </el-collapse-item>
      <el-collapse-item title="Vue binding usage" name="2">
        <pre><code class="language-html">
&#x3C;template&#x3E;
  {{vueTemplate}}
&#x3C;/template&#x3E;
        </code></pre>
      </el-collapse-item>
      <el-collapse-item title="Plain JavaScript binding usage" name="3">
        <pre><code class="language-javascript">
{{plainJavaScript}}
        </code></pre>
      </el-collapse-item>
      <el-collapse-item title="Browser's console binding usage" name="4">
        <div class="binding-demo__console"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import Vue from 'vue';
  import DemoElement from 'demo/components/DemoBinding-component';

  export default {/* eslint-disable indent */
    data() {
      return {
        activeNames: ['1'],
        vueTemplate: (
`<demo-basic
    :prop1="prop1"
    :prop2="prop2"
    :prop3="prop3"
    :string-prop="12"
    :long-prop-name="longPropName"
    :object-prop.prop="objectProp"
    :array-prop.prop="arrayProp">
  </demo-basic>`
        ),
        plainJavaScript: (
`document.getElementsByTagName('demo-basic')[0].prop1 = 123
document.getElementsByTagName('demo-basic')[0].prop2 = 'Text from JavaScript'
document.getElementsByTagName('demo-basic')[0].stringProp = '123'
document.getElementsByTagName('demo-basic')[0].objectProp = {foo: 'baz'}`
        )
      };
    },
    methods: {
      registerCustomElement() {
        Vue.customElement('demo-binding', DemoElement);
      }
    }
  };/* eslint-enable indent */
</script>

<style>
  .binding-demo__console {
    width: 100%;
    height: 100px;
    background: url('../assets/images/binding-console.png') no-repeat center;
    background-size: contain;
  }
</style>
