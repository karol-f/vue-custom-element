<template>
  <div class="card">
    <div class="el-form-item">
      <label class="el-form-item__label">prop1</label>
      <div class="el-form-item__content">
        <el-input-number v-model="prop1" size="small"></el-input-number>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">prop2</label>
      <div class="el-form-item__content">
        <el-input v-model="prop2" size="small"></el-input>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">prop3</label>
      <div class="el-form-item__content">
        <el-switch
          v-model="prop3"
          on-text=""
          off-text="">
        </el-switch>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">string-prop</label>
      <div class="el-form-item__content">
        <el-input v-model="stringProp" size="small"></el-input>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">boolean-prop</label>
      <div class="el-form-item__content">
        <el-input v-model="booleanProp" size="small"></el-input>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">number-prop</label>
      <div class="el-form-item__content">
        <el-input v-model="numberProp" size="small"></el-input>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">long-prop-name</label>
      <div class="el-form-item__content">
        <el-input v-model="longPropName" size="small"></el-input>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">object-prop</label>
      <div class="el-form-item__content">
        {{objectProp}}
        &nbsp;&nbsp;<el-button type="primary" @click="addObjectProperty(objectProp)" size="mini" icon="el-icon-plus"></el-button>
      </div>
    </div>

    <div class="el-form-item">
      <label class="el-form-item__label">array-prop</label>
      <div class="el-form-item__content">
        {{arrayProp}}
        &nbsp;&nbsp;<el-button type="primary" @click="addArrayElement(arrayProp)" size="mini" icon="el-icon-plus"></el-button>
      </div>
    </div>

    <br />

    <demo-basic
      :prop1="prop1"
      :prop2="prop2"
      :prop3="prop3 || 'false'"
      :string-prop="stringProp"
      :boolean-prop="booleanProp"
      :number-prop="numberProp"
      :long-prop-name="longPropName"
      :object-prop.prop="objectProp"
      :array-prop.prop="arrayProp"
    ></demo-basic>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    data() {
      return {
        prop1: 1,
        prop2: 'example text',
        prop3: true,
        stringProp: '12',
        booleanProp: 'true',
        numberProp: 42,
        longPropName: 'long name',
        objectProp: { foo: 'bar' },
        arrayProp: [1, 2, 3]
      };
    },
    methods: {
      addObjectProperty(object) {
        const keys = Object.keys(object);
        Vue.set(object, `property_${keys.length}`, keys.length);
      },
      addArrayElement(array) {
        array.push(array.length + 1);
      }
    }
  };
</script>

<style>
a.button.white {
  width: 140px;
  height: 30px;
  border-radius: 8px;
  font-size: 0.8em;
  padding: 4px;
  text-align: center;
  cursor: pointer;
}
</style>


