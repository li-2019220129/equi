<template>
  <div class="leadal-tree-component" :id="'leadal-tree-component'+key">
    <!-- suffix-icon="el-icon-date" -->
    <el-input v-model="value" @focus="focusTree"></el-input>
    <el-tree class="leadal-tree-node" :id="'leadal-tree-node'+key"
      :data="data"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      :check-strictly="true"
      @check-change="checkChange"
      :lazy="lazy"
      @load="lazy?loadNode:null"
      >
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'LeadalTreeSelect',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    value: {
      type: String,
      default: ''
    },
    lazy: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      // value: '',
      key: Math.random()
    }
  },
  mounted () {
    document.addEventListener('click', this.blurTree);
  },
  beforeDestroy () {
    document.removeEventListener('click', this.blurTree);
  },
  methods: {
    // 聚焦文本显示树形控件
    focusTree () {
      let child = document.getElementById('leadal-tree-node' + this.key);
      child.style.display = 'block';
    },
    // 超出范围隐藏控件
    blurTree (event) {
      let id = document.getElementById('leadal-tree-component' + this.key);
      let child = document.getElementById('leadal-tree-node' + this.key);
      if (!id || !id.contains(event.target)) {
        child.style.display = 'none';
      }
    },
    // 复选框勾选
    checkChange (node, check, data) {
      console.log(node, check, data);
    },
    loadNode (node, resolve) {
      this.$emit('load-node', {node, resolve})
    }
  }
}
</script>
<style scoped>
#leadal-tree-component{
  position: relative;
}
.leadal-tree-node{
  display: none;
  position: absolute;
  top: 34px;
  left: 0;
  z-index: 100;
  background-color: #fff;
  border: 1px solid #DCDFE6;
  width: 100%;
  border-radius: 4px;
}
</style>

