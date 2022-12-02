<template>
  <div>
      <template v-if="imgs(scopes.row[cols.value])">
        <img
          :src="scopes.row[cols.value]"
          class="img-class"
          @click="imgsClick(scopes.row[cols.value])"
        />
      </template>
      <template v-if="cols.click">
        <a  type="text" @click="cloumnClick(cols.value, scopes.row)" class="cloumnClick "><span class="ellipsis">{{ scopes.row[cols.value] | getData(cols) }}</span></a>
      </template>
      <template v-else-if="cols.editClick">
        <el-button type="text" @click="funclicks(cols,scopes)" :class="{'chooseColor':!cols.function}">{{ scopes.row[cols.value] }}</el-button>
        <div @click="editIconClick(cols.value, scopes.row)" class="editIcon"><el-icon class="el-icon-edit-outline editStyle"></el-icon></div>
      </template>
      <template v-else>
        <div :style="lwTableText(cols)">
          {{ scopes.row[cols.value] | getData(cols) }}
          <template
            v-if="scopes.row[cols.value] && scopes.row[cols.value] !== '无'"
          >
            <i
              v-if="cols.copy"
              class="el-icon-document-copy table-copy-icon"
              @click="copyClick(scopes.row[cols.value])"
            />
          </template>
        </div>
      </template>
  </div>
</template>

<script>
import { scientificNotation, imgsData , copyData } from "../tableUtils.js";
export default {
  filters: {
    getData(val, cols) {
      if (cols.scientific) {
        return scientificNotation(val);
      }
      return val;
    }
  },

  computed: {
    lwTableText() {
      return col => {
        if (col.copy) {
          return {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "80%"
          };
        }
      };
    },

    funclicks() {
      return (cols, scopes) => {
        return cols.function
          ? this.cloumnClick(cols.value, scopes.row)
          : () => {};
      };
    }
  },

  props: {
    scopes: {
      type: Object,
      default: null
    },
    cols: {
      type: Object,
      default: null
    }
  },
  watch: {
    scopes: {
      handler() {}
    }
  },
  methods: {
    imgs(url) {
      return imgsData(url);
    },

    copyClick(url) {
       copyData(url);
    },

    cloumnClick(field, row) {
      this.$emit("cloumnClick", field, row);
    },

    editIconClick(field, row) {
      this.$emit("editIconClick", field, row);
    },

    imgsClick(url) {
      // 打开图片
      this.$emit("openImg", url);
    }
  }
};
</script>

<style lang="scss" scoped>

.ellipsis{
  color: #1890ff;
}
.img-class {
  width: 100px;
  height: 100px;
  cursor: pointer;
}

.chooseColor {
  color: black;
  cursor: pointer;
}

.table-copy-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  cursor: pointer;
  color: #197afb;
}

.fistHover {
  width: 87%;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.editIcon {
  width: 13%;
  display: none;
}
.cell:hover {
  background: chocolate;
  .editIcon {
    display: flex;
    align-items: center;
    // float: right;
    // font-size: 18px;
    // cursor: pointer;
    // color: #197afb;
    // > .el-icon-edit-outline {
    //   line-height: 2;
    // }
  }
}
.el-icon-edit-outline {
  float: right;
  font-size: 20px;
  cursor: pointer;
  color: #197afb;
}
</style>


