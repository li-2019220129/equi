<template>
  <el-form
    v-if="visible"
    ref="form"
    :inline="inline"
    :model="form"
    :class="{ 'demo-form-inline': inline, flex: inline }"
    size="small"
    :label-width="labelWidth"
    :rules="rules"
    @submit.native.prevent="handleSubmit"
    label-position="left"
  >
    <!-- :picker-options="
            item.pickerOptions ? item.pickerOptions : pickerOptions
          " -->
    <template v-for="(item, index) in items">
      <el-form-item
        v-if="!item.hidden"
        :key="index"
        :class="{ 'multiple-line-top': !inline }"
        :label="item.type !== 'checkbox' ? item.label : ''"
        :prop="item.key"
      >
        <el-select
          v-if="item.type === 'select'"
          v-model="form[item.key]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :clearable="item.clearable"
          :multiple="item.multiple"
          :style="item.style"
          :filterable="item.filterable"
        >
          <el-option v-if="item.default" label="全部" value />
          <el-option
            v-for="(i, oIndex) in item.options"
            :key="oIndex"
            :label="i.label"
            :value="i.value"
            :disabled="i.disabled"
          />
        </el-select>

        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="form[item.key]"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy - MM - dd"
          clearable
        />

        <el-time-select
          v-else-if="item.type === 'timerange'"
          v-model="form[item.key]"
          :picker-options="{ start: '00:00', step: '01:00', end: '24:00' }"
          :clearable="item.clearable || false"
        />

        <slot
          v-else-if="item.type === 'slot'"
          :name="item.key"
          :form="form"
          :item="item"
          :options="item.options"
        />

        <el-date-picker
          v-else-if="
            item.type === 'date' ||
            item.type === 'datetime' ||
            item.type === 'week' ||
            item.type === 'month' ||
            item.type === 'year'
          "
          v-model="form[item.key]"
          :format="item.format || 'yyyy-MM-dd'"
          :type="item.type"
          :value-format="item.valueFormat || 'yyyy-MM-dd'"
          :placeholder="item.placeholder"
          :clearable="true"
        />

        <el-checkbox
          v-else-if="item.type === 'checkbox'"
          v-model="form[item.key]"
          >{{ item.label }}
        </el-checkbox>

        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="form[item.key]"
          :min="item.min"
          :disabled="item.disabled"
          :controls="false"
        />

        <template v-else>
          <el-row>
            <el-col :span="colContent(item)">
              <el-input
                v-model="form[item.key]"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :style="item.style"
                :type="item.type === 'textarea' ? 'textarea' : undefined"
              >
                <el-button
                  v-if="item.type === 'input-button'"
                  slot="append"
                  icon="el-icon-search"
                  @click="inputButton(item.label, item.key)"
                />
              </el-input>
            </el-col>

            <el-col :span="endContent(item)">
              <span style="margin-left: 5px">{{ item.endContent }}</span>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
    </template>
    <slot :form="form" />

    <div v-if="buttonFlag" class="buttons">
      <el-button
        v-if="isSearch"
        size="small"
        type="primary"
        @click.prevent="handleSearch"
        >确 定
      </el-button>
    </div>
    <el-form-item v-else>
      <el-button
        v-if="isSearch"
        size="small"
        type="primary"
        style="margin: 0 12px"
        class="submit-btn"
        @click.prevent="handleSearch"
        >
        <div class="btn-style"><i :class="search.icon" />{{ search.title }}</div>
      </el-button>
      <el-button
        v-if="isReset"
        size="small"
        type="info"
        class="cancel-btn"
        @click.prevent="handleReset('form')"
      >
        <div class="btn-style"><i class="el-icon-refresh-left" />重置</div>
      </el-button>
      <slot :form="form" name="button" />
    </el-form-item>
  </el-form>
</template>

<script>
import request from "@/utils/request";
export default {
  props: {
    options: {
      type: Object,
      default: null,
    },
    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      labelWidth: "",
      inline: true,
      visible: true,
      isReset: true,
      isSearch: true,
      buttonFlag: false,
      items: [],
      rules: {},
      form: {},
      search: {
        title: "搜索",
        icon: "el-icon-search",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },

  watch: {
    options: {
      immediate: true, // 首次默认为false 修改为true后，能首次自动触发
      async handler(data) {
        const val = JSON.parse(JSON.stringify(data));
        const result = {};
        if (
          val.options &&
          Object.prototype.toString.call(val.options) === "[object Array]"
        ) {
          let i = 0;
          const len = val.options.length;
          const d = val.options;

          for (i; i < len; i++) {
            result[d[i].key] =
              typeof d[i].value === "undefined" ? "" : d[i].value;

            if (
              (d[i].type === "select" || d[i].type === "checkbox") &&
              d[i].options
            ) {
              d[i].options = await this.resetOptions(d[i].options);
            }

            if (d[i].type === "checkbox") {
              result[d[i].key] = d[i].value || [];
            }

            if (d[i].rules) {
              this.rules[d[i].key] = d[i].rules;
            }
          }
        }

        this.labelWidth = val.labelWidth;
        this.buttonFlag = val.buttonFlag;
        this.inline = this.isBooleanValue(val.inline, this.inline);
        this.visible = this.isBooleanValue(val.visible, this.visible);
        this.isReset = this.isBooleanValue(val.isReset, this.isReset);
        this.isSearch = this.isBooleanValue(val.isSearch, this.isSearch);
        this.items = val.options || [];

        if (this.data) {
          this.form = this.data;
        } else {
          const dataResult = val.data || {};
          this.form = Object.keys(result).reduce((sum, item) => {
            sum[item] =
              dataResult[item] === "" || typeof dataResult[item] === "undefined"
                ? result[item]
                : dataResult[item];
            return sum;
          }, {});
        }

        this.search = {
          ...this.search,
          ...val.search,
        };
      },
      deep: true, // 深度
    },
  },
  methods: {
    interfaces(opt) {
      return request({
        url: opt.url,
        method: opt.methods,
      });
    },

    async resetOptions(opt) {
      const t = Object.prototype.toString.call(opt);
      if (t === "[object String]") {
        const res = await this.$axios.get(opt);
        return res.data;
      } else if (t === "[object Object]") {
        try {
          // const res  = await this.$axios.get(opt.url, {
          //   params: opt.params,
          //   headers: Object.assign({ loading: false }, opt.headers)
          // });
          let res = [];
          opt["methods"] !== undefined
            ? (res = await this.interfaces(opt))
            : (res = await this.getDicts(opt.url));

          // const res = await this.getDicts(opt.url);

          const resultData =
            Object.prototype.toString.call(res) === "[object Object]"
              ? opt["methods"] !== undefined
                ? res.rows
                : res.data
              : res;

          return [
            ...(opt.data || []),
            ...resultData.map((item) => ({
              label: item[opt.label || "label"],
              value: item[opt.value || "value"],
            })),
          ];
        } catch (error) {
          return [];
        }
      } else if (t === "[object Function]") {
        return opt();
      } else {
        return opt;
      }
    },

    isBooleanValue(val, value) {
      return typeof val === "undefined" ? value : val;
    },

    colContent(obj) {
      if (obj.endContent === undefined) {
        return 24;
      } else {
        return 18;
      }
    },

    endContent(obj) {
      if (obj.endContent === undefined) {
        return 0;
      } else {
        return 6;
      }
    },

    handleSearch() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("callback", this.form);
        } else {
          return false;
        }
      });
    },
    inputButton(label, key) {
      this.$emit("inputButton", label, key, this.form);
    },
    handleSubmit() {
      return false;
    },
    handleReset(formName) {
      this.$refs[formName].resetFields();
      this.$emit("handleReset", this.form);
    },
  },
};
</script>

<style lang="scss" scoped>
.multiple-line-top {
  margin-top: 15px;
}
.buttons {
  text-align: center;
}
</style>

