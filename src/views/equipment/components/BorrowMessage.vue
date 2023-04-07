<template>
  <div class="drawer-message">
    <el-form
      :model="applyForm"
      :rules="rules"
      ref="form"
      label-width="80px"
      label-position="right"
      :disabled="isDetail"
      v-loading="loading"
      style="margin-left: 15px"
    >
      <div class="drawer-form-title">申请信息</div>
      <div class="drawer-form">
        <el-form-item label="编号" prop="borrowCode">
          <!-- <label slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              编号
            </div>
          </label>-->
          <el-input v-model="applyForm.borrowCode"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="applyContent">
          <!-- <label slot="label">
            <div
              style="letter-spacing: 30px; position: absolute; margin-left: 5px"
            >
              标题
            </div>
          </label>-->
          <el-input v-model="applyForm.applyContent"></el-input>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="申请部门">
            <el-select v-model="organName" placeholder="请选择申请部门" style="width: 330px" disabled></el-select>
          </el-form-item>
          <el-form-item label="申请人" label-width="100px">
            <template slot="label">
              <div
                style="
                  letter-spacing: 8px;
                  margin-left: 5px;
                "
              >申请人</div>
            </template>
            <el-select
              v-model="applyForm.applyUserName"
              placeholder="请选择申请人"
              ref="tree"
              style="width: 330px"
              disabled
            >
              <el-option style="height: auto" :value="applyForm.applyUserName">
                <el-tree
                  :props="defaultProps"
                  :data="treeData"
                  node-key="id"
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
        </div>
        <el-form-item label="申请事由" prop="reason">
          <el-input type="textarea" v-model="applyForm.reason"></el-input>
        </el-form-item>
        <el-form-item v-if="active===3" label="审批意见" prop="option">
          <el-input type="textarea" v-model="applyForm.option"></el-input>
        </el-form-item>
        <el-form-item label="借用时间" prop="borrowTime">
          <el-date-picker
            v-model="applyForm.borrowTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>

        <div class="flex-item">
          <el-form-item label="使用范围" prop="useRange">
            <el-radio-group v-model="applyForm.useRange" style="width: 330px">
              <el-radio :label="1">单位内</el-radio>
              <el-radio :label="2">单位外</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="保管方式">
            <el-input v-model="applyForm.storageWay" style="width: 330px"></el-input>
          </el-form-item>
        </div>

        <div class="flex-item">
          <el-form-item label="申请时间" prop="applyTime">
            <el-date-picker
              v-model="applyForm.applyTime"
              type="date"
              style="width: 330px"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactWay">
            <el-input v-model="applyForm.contactWay" style="width: 330px"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="apply-form">
        <div class="drawer-form-title">设备信息</div>
        <div class="flex-item">
          <el-form-item label="设备分类" prop="categoryLabel">
            <el-select
              v-model="applyForm.categoryLabel"
              multiple
              placeholder="请选择设备分类"
              class="form-styles"
              ref="el-select"
              style="width: 330px"
            >
              <el-option
                :label="item.caption"
                :value="item.id"
                style="height: auto"
                :key="index"
                v-for="(item,index) in categoryData"
              ></el-option>
              <!-- <el-option style="height: auto" :value="applyForm.categoryLabel">
                <el-tree
                  :props="defaultProps"
                  :data="categoryData"
                  node-key="id"
                  ref="treeSearch"
                  class="tree-no-background"
                  @node-click="categoryClick"
                >
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <tree-slot :node="node" :data="data"></tree-slot>
                  </div>
                </el-tree>
              </el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="设备标签" prop="tab">
            <el-select
              v-model="applyForm.tab"
              placeholder="请选择设备标签"
              class="form-styles"
              style="width: 330px"
            >
              <el-option
                v-for="item in tabOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="flex-item">
          <el-form-item label="设备数量" prop="devCount">
            <el-input-number v-model="applyForm.devCount" :min="1" :max="10" style="width: 330px"></el-input-number>
          </el-form-item>

          <el-form-item label="设备密级" prop="secret">
            <el-select v-model="applyForm.secret" placeholder="请选择设备密级" style="width: 330px">
              <el-option
                v-for="item in secretOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div class="apply-form" v-if="btnTitle === '确认借出'||btnTitle==='待归还'||btnTitle==='已归还'">
      <equipment-message
        :maxHeight="'calc(20vh - 17px)'"
        :equipmentTab="applyForm.tab"
        :editId="editId"
        :devIds.sync="applyForm.devIds"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script>
import EquipmentMessage from "./EquipmentMessage.vue";
import TreeSlot from "@/components/TreeSlot/index.vue";
import moment from "moment";
import { createId } from "@/api/common/index";
import { viewDetail, getDeviceKindTree } from "@/api/equipment";
export default {
  name: "BorrowMessage",
  components: {
    EquipmentMessage,
    TreeSlot
  },
  inject: ["root"],
  props: {
    formLine: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: "add"
    }
  },
  created() {
    this.createIdData();
    this.getDeviceKindTreeData();
  },
  data() {
    return {
      active:this.root.activeTab,
      loading: false,
      title: this.root.title,
      isDetail: this.root.isDetail,
      btnTitle: this.root.btnTitle,
      treeData: this.$store.state.login.userTreeData, //树
      organName: this.$store.state.login.loginData.organName,
      applyForm: {
        id: "", //任务主键
        borrowTime: [],
        borrowCode: "", //编号
        applyContent: "", //标题
        reason: "",
        useRange: 1,
        applyTime: moment(new Date()).format("YYYY-MM-DD"),
        devIds: "", //设备id
        storageWay: "", //保管方式
        contactWay: "", //联系方式
        applyUserId: this.$store.state.login.loginData.userId, //申请人主键
        applyUserName: this.$store.state.login.loginData.userName, //申请人名称
        categoryLabel: "", //设备分类名字
        categoryId: "", //设备分类id
        tab: "", //设备标签
        secret: "", //设备密级
        devCount: 1, //设备数量
        option:null,
        plainBeginDate:'',
        plainGiveDate:''
      },
      cloneDorrowTime: [],
      editId: "", //编辑id
      editDevTable: [], //编辑时的借用设备信息
      categoryData: [], //树
      defaultProps: {
        children: "children",
        label: "caption"
      },
      tabOptions: this.$store.state.login.equipmentTab,
      secretOptions: this.$store.state.login.equipmentSecret,
      rules: {
        applyContent: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        borrowTime: [
          { required: true, message: "请选择借用时间", trigger: "change" }
        ],
        useRange: [
          { required: true, message: "请选择使用范围", trigger: "change" }
        ],
        contactWay: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "联系方式格式不正确",
            trigger: "blur"
          }
        ],
        categoryLabel: [
          { required: true, message: "请选择设备分类", trigger: "change" }
        ],
        devCount: [
          { required: true, message: "请输入设备数量", trigger: "blur" }
        ],
        secret: [
          { required: true, message: "请选择设备密级", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    formLine: {
      immediate: true,
      async handler() {
        if (JSON.stringify(this.formLine) !== "{}") {
          this.loading = true;
          this.editId = this.formLine.id;

          const params = {
            id: this.formLine.id,
            currentUserId: this.$store.state.login.loginData.userId
          };
          const res = await viewDetail(params);
          const editObj = res.data;
          this.editDevTable = editObj.devInfo;

          Object.assign(this.applyForm, editObj.recordData);

          //借用时间回显
          if (editObj.recordData.borrowTime) {
            // const beginTime = editObj.recordData.borrowTime.substr(0, 10);
            // const endTime = editObj.recordData.borrowTime.substr(10);

            this.applyForm.borrowTime = [editObj.recordData.plainBeginDate, editObj.recordData.plainGiveDate];
          }
          //已选设备回显
          this.applyForm.devIds = editObj.devInfo
            .map(item => item.id)
            .join(",");

          this.loading = false;
        } else {
          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });
        }
      },
      deep: true
    },
    btnTitle: {
      immediate: true,
      handler(val) {
        if (val === "确认借出") this.isDetail = true;
      }
    }
  },
  methods: {
    createIdData() {
      createId().then(res => {
        this.applyForm.id = res.data;
      });
    },
    async getDeviceKindTreeData() {
      const res = await getDeviceKindTree({ type: 1 });
      this.categoryData = res.data;
    },

    handleNodeClick(node) {
      if (node.ntype === "User") {
        this.applyForm.applyUserName = node.caption;
        this.applyForm.applyUserId = node.id;
        this.$refs.tree.blur();
      }
    },

    categoryClick(node) {
      this.applyForm.categoryLabel = node.caption;
      this.applyForm.categoryId = node.id;
      this.$refs.tree.blur();
    },

    saveBorrow() {
      this.cloneDorrowTime = this.$cloneDeep(this.applyForm.borrowTime);
      if (this.applyForm.borrowTime) {
        console.log(this.applyForm, "66666666");
        this.applyForm.plainBeginDate = this.applyForm.borrowTime[0]
        this.applyForm.plainGiveDate = this.applyForm.borrowTime[1]
        this.applyForm.borrowTime = Array.isArray(this.applyForm.borrowTime)
          ? this.applyForm.borrowTime.join("-")
          : [];
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("saveBorrow", this.applyForm);
          this.applyForm.borrowTime = this.cloneDorrowTime;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-message {
  overflow-y: auto;
}
.flex-item {
  display: flex;
  justify-content: space-between;
}
.drawer-form-title {
  font-family: SourceHanSansCN-Medium;
  font-size: 22px;
  margin: 10px 0;
  color: #3d464c;
  letter-spacing: 0;
  font-weight: 500;
}
.apply-form {
  margin-top: -20px;
}
</style>
