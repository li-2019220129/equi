<template>
  <div>
    <span
      v-show="!isDetail"
      style="
        display: inline-block;
        color: red;
        font-size: 20px;
        margin-top: 10px;
      "
      >提示：保密室资产用于设备借用</span
    >
    <div class="dialog-btn-layout" v-show="!isDetail">
      <div class="handle send" @click="handleSave(true)">保存并送审</div>
      <div class="handle save" @click="handleSave(false)">保存</div>
    </div>
    <hr />
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="margin-top: 20px"
      v-loading="loading"
      :disabled="isDetail"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类别" prop="classify">
            <el-select
              v-model="form.classify"
              placeholder="请选择"
              class="form-styles"
            >
              <el-option
                v-for="item in classifyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备分类" prop="categoryLabel">
            <el-select
              v-model="form.categoryLabel"
              placeholder="请选择"
              class="form-styles"
              ref="el-select"
            >
              <el-option style="height: auto" :value="form.categoryId">
                <el-tree
                  :props="defaultProps"
                  :data="treeData"
                  node-key="id"
                  ref="treeSearch"
                  class="tree-no-background"
                  @node-click="handleNodeClick"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <tree-slot :node="node" :data="data"></tree-slot>
                  </div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="设备标签" prop="tab">
            <el-select
              v-model="form.tab"
              placeholder="请选择"
              class="form-styles"
              :disabled="form.classify === 4"
            >
              <el-option
                v-for="item in tabOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->

        <el-col :span="12">
          <el-form-item label="设备品牌" prop="brand">
            <el-input v-model="form.brand" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备型号" prop="model">
            <el-input v-model="form.model" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label prop="sn">
            <template slot="label">
              <div style="display: inline-block; letter-spacing: 5px">
                序列号
              </div>
            </template>
            <el-input v-model="form.sn" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="购置时间" prop="purchaseDate">
            <el-date-picker
              v-model="form.purchaseDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="form-styles"
            ></el-date-picker>
          </el-form-item>
        </el-col>!-->

        <el-col :span="12">
          <el-form-item label="启用时间" prop="enabledTime">
            <el-date-picker
              v-model="form.enabledTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="form-styles"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备密级" prop="secret">
            <el-select
              v-model="form.secret"
              placeholder="请选择"
              class="form-styles"
            >
              <el-option
                v-for="item in secretOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="载体编号" prop="secretRoomCode">
            <el-input v-model="form.secretRoomCode" class="form-styles"></el-input>
          </el-form-item>
        </el-col>-->

        <el-col :span="12">
          <el-form-item label="保密编号" prop="secretRoomCode">
            <el-input
              v-model="form.secretRoomCode"
              class="form-styles"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="门禁编号" prop="entranceGuardCode">
            <el-input v-model="form.entranceGuardCode" class="form-styles"></el-input>
          </el-form-item>
        </el-col>-->

        <el-col :span="12">
          <el-form-item label="存放位置" prop="storagePlace">
            <el-input
              v-model="form.storagePlace"
              class="form-styles"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label prop="camp">
            <template slot="label">
              <div style="display: inline-block; letter-spacing: 12px">
                营区
              </div>
            </template>
            <el-select
              v-model="form.camp"
              placeholder="请选择"
              class="form-styles"
            >
              <el-option
                v-for="item in campOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="ownerOrganId">
            <!-- <el-cascader
              :value="form.ownerOrganId"
              class="form-styles"
              size="mini"
              :options="options"
              :props="props"
              @change="change"
              :show-all-levels="false"
            ></el-cascader> -->
            <ElSelectTree
              v-model="form.ownerOrganId"
              :data="options"
              class="form-styles"
              :props="props"
              check-strictly
              clearable
            ></ElSelectTree>
            <!-- <el-input
              v-model="form.organName"
              class="form-styles"
            ></el-input>-->
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24">
          <el-form-item label="原因用途" prop="reason">
            <el-input
              type="textarea"
              v-model="form.reason"
              placeholder="请输入内容"
              :rows="5"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>-->
        <el-col v-if="active === 3" :span="24">
          <el-form-item label="审批意见" prop="option">
            <el-input
              type="textarea"
              v-model="form.option"
              placeholder="请输入内容"
              :rows="5"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  saveDirectly,
  loadEditData,
  loadRecordByInfoId,
} from "@/api/equipment/index";
import { createId } from "@/api/common/index";
import { organTreeApi } from "@/api/audit/index";
import TreeSlot from "@/components/TreeSlot/index.vue";
import ElSelectTree from "el-select-tree";
import moment from "moment";
export default {
  components: {
    TreeSlot,
    ElSelectTree,
  },
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    formLine: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "add",
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    infoId: {
      type: String,
      default: "",
    },
  },
  inject: ["root"],
  data() {
    return {
      active: this.root.activeTab,
      networkLoading: false,
      loading: false,
      nodeCount: 0, //树双击收缩
      createId: "", // 创建ID
      form: {
        id: "", //主键
        tab: "", //设备标签名称
        categoryLabel: "", // 设备分类名称
        categoryId: "", // 设备分类
        brand: "", // 设备品牌
        model: "", // 设备型号
        sn: "", // 序号
        purchaseDate: "", //购置时间
        enabledTime: "", // 启用时间
        secret: "", // 设备密级
        secretRoomCode: "", // 载体编号
        code: "", // 保密系统编号
        entranceGuardCode: "", // 门禁编号
        storagePlace: "", // 存放位
        classify: "", // 设备类型
        reason: "", // 原因用途
        // organName: this.$store.state.login.loginData.organName, // 部门
        ownerOrganName: "",
        option: null,
        ownerOrganId: null,
        camp: null, //营区
      },
      rules: {
        categoryLabel: [
          { required: true, message: "请选择设备分类", trigger: "change" },
        ],
        secretRoomCode: [
          { required: true, message: "请输入载体编号", trigger: "blur" },
        ],
        // code: [
        //   { required: true, message: "请输入保密系统编号", trigger: "blur" }
        // ],
        model: [{ required: true, message: "请输入设备型号", trigger: "blur" }],
        camp: [{ required: true, message: "请输入营区", trigger: "blur" }],
        brand: [{ required: true, message: "请输入设备品牌", trigger: "blur" }],
        sn: [{ required: true, message: "请输入序列号", trigger: "blur" }],
        storagePlace: [
          { required: true, message: "请输入存放位置", trigger: "blur" },
        ],
        ownerOrganId: [
          { required: true, message: "请选择部门", trigger: "blur" },
        ],
        classify: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        secret: [
          { required: true, message: "请选择设备密级", trigger: "change" },
        ],
      },
      classifyOptions: [
        {
          value: 4,
          label: "个人资产",
        },
        {
          value: 8,
          label: "保密室资产",
        },
      ],
      tabList: [],
      tabOptions: this.$store.state.login.equipmentTab,
      secretOptions: this.$store.state.login.equipmentSecret,
      campOptions: [
        {
          name: "万寿路营区",
          value: 1,
        },
        {
          name: "昌平营区",
          value: 2,
        },
        {
          name: "六里桥营区",
          value: 3,
        },
      ],
      defaultProps: {
        children: "children",
        label: "caption",
      },
      options: [],
      props: {
        value: "id",
        label: "caption",
        children: "childs",
        emitPath: false,
      },
    };
  },
  async mounted() {
    const res = await organTreeApi();
    this.options = res.data;
  },
  watch: {
    formLine: {
      immediate: true,
      handler() {
        if (this.formLine && JSON.stringify(this.formLine) !== "{}") {
          try {
            this.loading = true;
            if (this.infoId) {
              const params1 = {
                infoId: this.infoId,
              };
              loadRecordByInfoId(params1).then((res) => {
                Object.assign(this.form, res.data);
              });
            } else {
              const params2 = {
                deviceRecordId: this.formLine.deviceRecordId,
              };
              loadEditData(params2).then((res) => {
                Object.assign(this.form, res.data);

                this.form.categoryLabel = res.data.categoryLabel
                  ? res.data.categoryLabel
                  : res.data.kindLabel;
                this.form.ownerOrganName = res.data.ownerOrganName;
                console.log(this.form, "oooooo");
              });
            }
            this.loading = false;
          } catch (error) {
            this.loading = false;
          }
        } else {
          this.$nextTick(() => {
            this.createIdData();
            this.$refs.form.resetFields();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    // change(value) {
    //   console.log(value, "12456");
    //   this.form.ownerOrganId = value;
    // },
    createIdData() {
      createId().then((res) => {
        this.createId = res.data;
      });
    },

    handleNodeClick(node) {
      this.nodeCount++;
      if (this.nodeCount === 2) {
        this.$refs["el-select"].blur();
      }
      this.nodeTimer = setTimeout(() => {
        //300ms内没有第二次点击就把第一次点击的清空
        this.nodeCount = 0;
      }, 300);

      this.form.categoryLabel = node.caption;
      this.form.categoryId = node.id;
    },

    handleSave(flag) {
      if (this.networkLoading) return;
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const params = {
            id: this.type === "add" ? this.createId : this.form.id, //任务主键
            deviceRecordId:
              this.type === "add" ? null : this.formLine.deviceRecordId,
            stockinUserId: this.$store.state.login.loginData.userId, //入库人主键
            // stockinTime: "2022-08-12", //入库时间
            categoryId: this.form.categoryId, //设备分类Id
            name: "", //设备名称
            brand: this.form.brand, //设备品牌
            model: this.form.model, //设备型号
            purchaseDate: ["", null].includes(this.form.purchaseDate)
              ? ""
              : moment(this.form.purchaseDate).format("YYYY-MM-DD"), //购置时间
            sn: String(this.form.sn), //序号
            secret: this.form.secret, //密级
            code: String(this.form.code), //保密系统编号
            classify: this.form.classify, //设备类别
            ownerOrganId: this.form.ownerOrganId, //所属部门
            tab: this.form.tab, //设备标签
            reason: this.form.reason,
            camp: this.form.camp,
            extList: [
              {
                fieldName: "enabledTime", //英文名称
                fieldLabel: "启用时间", //中文名称
                fieldValue: ["", null].includes(this.form.enabledTime)
                  ? ""
                  : moment(this.form.enabledTime).format("YYYY-MM-DD"),
              },
              {
                fieldName: "secretRoomCode", //英文名称
                fieldLabel: "载体编号", //中文名称
                fieldValue: String(this.form.secretRoomCode),
              },
              {
                fieldName: "entranceGuardCode", //英文名称
                fieldLabel: "门禁编号", //中文名称
                fieldValue: String(this.form.entranceGuardCode),
              },
              {
                fieldName: "storagePlace", //英文名称
                fieldLabel: "存放位置", //中文名称
                fieldValue: this.form.storagePlace,
              },
              {
                fieldName: "reason", //英文名称
                fieldLabel: "原因用途", //中文名称
                fieldValue: this.form.reason,
              },
            ],
          };
          this.networkLoading = true;
          const { status, msg } = await saveDirectly(params);
          // this.$message.success(msg);
          this.$message({
            type: "success",
            duration: 1000,
            message: msg,
          });
          if (status == 200) {
            this.networkLoading = false;
          } else {
            // this.$message.error(msg);
            this.$message({
              type: "error",
              duration: 1000,
              message: msg,
            });
            this.networkLoading = false;
          }
          if (flag) {
            this.$emit("handleParams", params);
          } else {
            this.$emit("close");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" src="./headerScss.scss" scoped></style>

<style lang="scss" scoped>
::v-deep .el-tree-node__content > label.el-checkbox {
  margin-right: -18px;
  margin-left: 20px;
  margin-top: -3px;
}


// 对树的样式进行修改
::v-deep .el-tree-node__content {
  height: 38px;
  // padding-left: 20px !important;
}
.custom-tree-node{
  width: 100%;
  height: 100%;
}



// 树形控件

.leadal-menu-tree .el-tree {
  color: #3b3b3b;
}
.leadal-menu-tree .el-tree-node__label {
  font-size: 20px;
}
.leadal-menu-tree .el-tree-node__content:hover {
  background-color: #dff1ff;
}
.leadal-menu-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #dff1ff;
}

// 树样式

::v-deep .el-tree-node__expand-icon {
  display: none;
}

// .el-tree-node__content {
//   margin-left: 20px;
// }



.child-triangle {
  transition: all 0.3s;
  margin-left: -20px;
  &.rodge {
    transform: rotate(90deg);
  }
  &.treeTriangle {
    margin: 0 30px !important;
    margin-left: -50px !important;
  }
  &.treeTriangleSelect{
    margin: 0 30px !important;
    margin-left: -40px !important;
  }
}

::v-deep .el-tree-node__loading-icon {
  /* margin-right: 8px; */
  font-size: 14px;
  margin: 0 0 0 3px;
  color: #c0c4cc;
  position: absolute;
  // left: 0;
}
.form-styles {
  width: 420px;
  height: 32px;
}
</style>
