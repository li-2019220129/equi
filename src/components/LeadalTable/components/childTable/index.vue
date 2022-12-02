<template>
  <el-table-column
    :value="col.value"
    :label="col.label"
    :align="col.align || 'left'"
    :min-width="setWidth(col)"
    :render-header="(h, obj) => renderHeader(h, obj, col)"
    :show-overflow-tooltip="true"
  >
    <template v-if="col.children">
      <my-column v-for="(item, index) in col.children" :key="index" :col="item"></my-column>
    </template>

    <template slot-scope="scope">
      <ex-slot
        v-if="col.render"
        :render="col.render"
        :row="scope.row"
        :index="scope.$index"
        :column="col"
      ></ex-slot>
      <template v-else>
        <Shared-Components :scopes="scope" :cols="col" @openImg="imgsClick"></Shared-Components>
      </template>
    </template>
  </el-table-column>
</template>

<script>
const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    };
    if (data.props.column) {
      params.column = data.props.column;
    }

    return data.props.render(h, params);
  }
};
import { scientificNotation, imgsData } from "../../tableUtils.js";
import SharedComponents from "../sharedComponents";
import { setWidths, renderHeader } from "../../tableUtils.js";
export default {
  name: "MyColumn",
  data() {
    return {};
  },
  props: {
    col: {
      type: Object,
      default: null
    }
  },

  filters: {
    getData(val, col) {
      if (col.scientific) {
        return scientificNotation(val);
      }
      return val;
    }
  },

  computed: {
    setWidth() {
      return col => {
        return setWidths(col);
      };
    }
  },

  methods: {
    cloumnClick(attr, row) {
      this.$emit("cdata", attr, row);
    },

    renderHeader(h, { column }, col) {
      return renderHeader(h, { column }, col);
    },
    
    imgsClick(url) {
      // 打开图片
      this.$emit("openImg", url);
    },

    imgs(url) {
      return imgsData(url);
    }
  },
  mounted() {},
  //自定义组件
  components: {
    "ex-slot": exSlot,
    SharedComponents
  }
};
</script>
<style lang="scss" scoped>
.img-class {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
</style>
