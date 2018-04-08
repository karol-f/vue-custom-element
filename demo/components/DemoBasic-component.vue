<template>
  <div class="card card--primary">
    <h4>{{ message }}</h4>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="prop"
        label="Prop name">
      </el-table-column>
      <el-table-column
        prop="value"
        label="Value">
        <template slot-scope="scope">
          <div slot="reference">
            <strong>{{ scope.row.value }}</strong>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="typeof">
        <template slot-scope="scope">
          <div slot="reference">
            <el-tag type="gray">{{ scope.row.type }}</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      prop1: {},
      prop2: {},
      prop3: {},
      stringProp: {
        type: String
      },
      longPropName: {},
      objectProp: {},
      arrayProp: {}
    },
    data() {
      return {
        message: 'Hello Vue-custom-element!'
      };
    },
    computed: {
      tableData() {
        const data = [{
          prop: 'prop1',
          value: JSON.stringify(this.prop1),
          type: typeof this.prop1
        }, {
          prop: 'prop2',
          value: JSON.stringify(this.prop2),
          type: typeof this.prop2
        }, {
          prop: 'prop3',
          value: JSON.stringify(this.prop3),
          type: typeof this.prop3
        }, {
          prop: 'stringProp',
          value: this.stringProp,
          type: typeof this.stringProp
        }, {
          prop: 'long-prop-name',
          value: JSON.stringify(this.longPropName),
          type: typeof this.longPropName
        }];

        this.objectProp && data.push({
          prop: 'objectProp',
          value: this.objectProp,
          type: typeof this.objectProp
        });

        this.arrayProp && data.push({
          prop: 'arrayProp',
          value: this.arrayProp,
          type: typeof this.arrayProp
        });

        return data;
      }
    },
    created() {
      /* eslint-disable no-console */
      console.log('demo-basic created()');
    }
  };
</script>

