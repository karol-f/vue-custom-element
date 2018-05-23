<template>
  <div>
    <h2>Slots demo</h2>

    <div class="demo-card">
      <demo-slots>
        <template slot id="header">
          <h3>Template Header Slot</h3>

          With an h3 header and a basic text node
        </template>
        <span>Default slot</span>
        <span vue-slot="footer">Footer slot passed from outside</span>
      </demo-slots>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="Description" name="1">
        <p>You can use default and named slots to pass static content to Vue component.</p>
        <p>Please note that when using named slots, instead of <code>slot="slotName"</code> you have to use <code>vue-slot="slotName"</code>.</p>
        <p>Dynamic content woun't work due to fact that when Custom Element register we replace it's HTML with Vue component template.</p>
        <p>
          Use
          <ul>
            <li>attributes/props for dynamic content</li>
            <li>slots for static content</li>
          </ul>
        </p>

        <h4>Using Template Tags</h4>

        <p>
          To use template tags to add content without necessitating the need for an element wrapper,
          you can follow the following pattern:
        </p>

        <p>
          <code>&lt;template slot id="header"&gt;My Content&lt;/template&gt;</code>
        </p>

        <p>
          You would need to add the slot attribute (not a vue-slot) and provide an
          <code>id</code> attribute that matches the name of the slot you wish to add
          content to.
        </p>

        <h4>Passing Custom Elements Inside Slots</h4>

        <p>
          When passing custom elements inside of slots, you may get errors that warn about
          <code>Unknown custom element</code>. There are two ways around this.


          <ol>
            <li>
              <p>Add your custom element to a list of ignored elements in the vue config:<p>
              <p>
                <code>Vue.config.ignoredElements.push('my-custom-element')</code>
              </p>
            </li>

            <li>
              <p>
                Make sure the elments being inserted into another element are created as custom
                elements first:
              </p>

              <p>
                <pre><code class="language-javascript">
Vue.customElement('custom-child-one', CustomChildOne)
Vue.customElement('custom-child-two', CustomChildTwo)

Vue.customElement('custom-parent', CustomParent)
                </code></pre>

                <br />

                <pre><code class="language-html">
&lt;custom-parent&gt;
  &lt;template slot id="some-id"&gt;
    &lt;custom-child-one&gt;&lt;/custom-child-one&gt;
    &lt;custom-child-two&gt;&lt;/custom-child-one&gt;
  &lt;/template&gt;
&lt;/custom-parent&gt;
                </code></pre>
              </p>
            </li>
          </ol>
        </p>
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

Vue.customElement('demo-slots', DemoElement);
        </code></pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import Vue from 'vue';
  import DemoElement from 'demo/components/DemoSlots-component';

  export default { /* eslint-disable indent */
    data() {
      return {
        activeNames: ['1'],
        HTML: (
`<demo-slots>
  <template slot id="header">
    <h3>Template Header Slot</h3>

    With an h3 header and a basic text node
  </template>
  <span>Default slot</span>
  <span vue-slot="footer">Footer slot passed from outside</span>
</demo-slots>`
        ),
        vueTemplate: (
`<div>
    <el-alert title="" type="info">
      <slot name="header">No HEADER slot content passed (this is default value)</slot>
    </el-alert>

    <p>This is text from inside of the element</p>

    <el-alert title="" type="info">
      <slot>No DEFAULT slot content passed (this is default value)</slot>
    </el-alert>

    <el-alert title="" type="info">
      <slot name="footer">No FOOTER slot content passed (this is default value)</slot>
    </el-alert>
  </div>`
        ),
        vueScript: 'export default {};'
      };
    },
    methods: {
      registerCustomElement() {
        Vue.customElement('demo-slots', DemoElement);
      }
    }
  };/* eslint-enable indent */
</script>

