<template>
  <div>
    <h2>Basic demo</h2>

    <div class="demo-card">
      <demo-basic prop1="1" prop2="example text" prop3="true" long-prop-name="long name"><!-- Some comments --></demo-basic>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="Description" name="1">
        <p>Let's add basic component to see if values from HTML attributes are visible inside Vue component. We will also check if numbers and booleans are properly detected.</p>

        <p>After registering <strong>"demo-basic"</strong> tag, you can insert that tag into standard HTML, SPA's, React, Angular or Vue projects without the hassle and further initialization.</p>

        <p>Code examples below are written in ES2015 version of JavaScript, but feel free to use ES5.</p>

      </el-collapse-item>
      <el-collapse-item title="Custom Element HTML" name="2">
        <pre><code class="language-html">
{{HTML}}
        </code></pre>
      </el-collapse-item>
      <el-collapse-item title="Vue component passed to Vue-custom-element" name="3">
        <pre><code class="language-html">
&#x3C;template&#x3E;
  {{vueTemplate}}
&#x3C;/template&#x3E;

&#x3C;script&#x3E;
  {{vueScript}}
&#x3C;/script&#x3E;
        </code></pre>
      </el-collapse-item>
      <el-collapse-item title="JavaScript - register with Vue-custom-element" name="4">
        <pre><code class="language-javascript">
import DemoElement from 'DemoElement.vue';

Vue.customElement('demo-basic', DemoElement);
        </code></pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import Vue from 'vue';
  import DemoElement from 'demo/components/DemoBasic-component';

  export default { /* eslint-disable indent */
    data() {
      return {
        message: 'Hello Vue!',
        activeNames: ['1'],
        HTML: (
`<demo-basic
  prop1="1"
  prop2="example text"
  prop3="true"
  long-prop-name="long name">
</demo-basic>`
        ),
        vueTemplate: (
`<div>
    <h4>{{ message }}</h4>

    <el-table :data="tableData">
      <el-table-column prop="prop" label="Prop name"></el-table-column>
      <el-table-column prop="value" label="Value"></el-table-column>
      <el-table-column prop="type" label="typeof"></el-table-column>
    </el-table>
  </div>`
        ),
        vueScript: (
`export default {
    props: [
      'prop1',
      'prop2',
      'prop3',
      'longPropName'
    ],
    data() {
      return {
        message: 'Hello Vue-custom-element!'
      };
    },
    computed: {
      tableData() {
        return [{
          prop: 'prop1',
          value: this.prop1,
          type: typeof this.prop1
        }, {
          prop: 'prop2',
          value: this.prop2,
          type: typeof this.prop2
        }, {
          prop: 'prop3',
          value: this.prop3,
          type: typeof this.prop3
        }, {
          prop: 'long-prop-name',
          value: this.longPropName,
          type: typeof this.longPropName
        }];
    },
    created() {
      console.info('demo-basic created()');
    }
  };`
        )
      };
    },
    methods: {
      registerCustomElement() {
        Vue.customElement('demo-basic', DemoElement);
      }
    }
  };/* eslint-enable indent */
</script>

