<template>
  <div>
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
              >
              </el-option>
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

        <el-col :span="12">
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
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备品牌" porp="brand">
            <el-input v-model="form.brand" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备型号" prop="model">
            <el-input v-model="form.model" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="" prop="sn">
            <template slot="label">
              <div
                style="
                  letter-spacing: 8px;
                  position: absolute;
                  margin-left: 45px;
                "
              >
                序列号
              </div>
            </template>
            <el-input v-model="form.sn" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="购置时间" prop="purchaseDate">
            <el-date-picker
              v-model="form.purchaseDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="form-styles"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="启用时间" prop="enabledTime">
            <el-date-picker
              v-model="form.enabledTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="form-styles"
            >
            </el-date-picker>
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
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="载体编号" prop="secretRoomCode">
            <el-input
              v-model="form.secretRoomCode"
              class="form-styles"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="保密系统编号" prop="code">
            <el-input v-model="form.code" class="form-styles"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="门禁编号" prop="entranceGuardCode">
            <el-input
              v-model="form.entranceGuardCode"
              class="form-styles"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="存放位置" prop="storagePlace">
            <el-input
              v-model="form.storagePlace"
              class="form-styles"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属部门" prop="organName">
            <el-cascader
              v-model="form.organName"
              class="form-styles"
              size="mini"
              :props="props"
            ></el-cascader>
            <!-- <el-input
              v-model="form.organName"
              class="form-styles"
            ></el-input> -->
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="原因用途" prop="reason">
            <el-input
              type="textarea"
              v-model="form.reason"
              placeholder="请输入内容"
              :rows="5"
              style="width: 1046px"
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
import moment from "moment";
export default {
  components: {
    TreeSlot,
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

  data() {
    return {
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
        organName: this.$store.state.login.loginData.organName, // 部门
      },
      rules: {
        categoryLabel: [
          { required: true, message: "请选择设备分类", trigger: "change" },
        ],
        secretRoomCode: [
          { required: true, message: "请输入载体编号", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入保密系统编号", trigger: "blur" },
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
      defaultProps: {
        children: "children",
        label: "caption",
      },
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          // const { level } = node;
          console.log(node)
          const res = await organTreeApi({
            id: node.level===0?null:node.value,
          });
          resolve(res.data)
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 })
          //     .map(item => ({
          //       value: ++id,
          //       label: `选项${id}`,
          //       leaf: level >= 2
          //     }));
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes);
          // }, 1000);
        },
        value:'id',
        label:'caption',
        checkStrictly:true,
        emitPath:false
      },
    };
  },
  watch: {
    formLine: {
      immediate: true,
      handler() {
        if (this.formLine&&JSON.stringify(this.formLine) !== "{}") {
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
            ownerOrganId: this.$store.state.login.loginData.organId, //所属部门
            tab: this.form.tab, //设备标签
            reason: this.form.reason,
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
          this.$message.success(msg);
          if (status == 200) {
            this.networkLoading = false;
          } else {
            this.$message.error(msg);
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
.form-styles {
  width: 420px;
  height: 32px;
}
</style>
