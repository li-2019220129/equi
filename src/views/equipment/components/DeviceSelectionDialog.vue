<template>
  <div>
    <div class="dialog-btn-layout">
      <div class="handle sure" @click="selectDevice">选择确认</div>
    </div>
    <hr />
    <el-form
      :inline="true"
      ref="form"
      :model="form"
      label-width="120px"
      class="demo-form-inline"
      style="margin-top: 20px"
    >
      <el-form-item prop="content">
        <el-input
          v-model="form.content"
          style="width: 310px"
          placeholder="请输入品牌/型号/序列号关键字"
          @keyup.enter.native="getData"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click="getData"
          ></i>
        </el-input>
      </el-form-item>
      <!-- @change="moreSearch('categoryId')" -->

      <el-form-item prop="categoryLabel">
        <el-select
          v-model="form.categoryLabel"
          placeholder="请选择设备分类"
          clearable
          style="width: 220px"
          ref="el-select"
          @change="getData"
        >
          <el-option style="height: auto" :value="form.categoryLabel">
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

      <el-form-item prop="tab" v-if="drawerTitle === '设备借用'">
        <el-select
          v-model="form.tab"
          placeholder="请选择设备标签"
          clearable
          @change="getData"
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
    </el-form>

    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :page="config.currentPage"
      :size="config.pageSize"
      :total="config.total"
      v-loading="tableObj.loading"
      ref="leadalTable"
      :height="'calc(100vh - 600px)'"
      :selection.sync="selection"
      @page-change="pageChange"
    ></leadal-table>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable/index.vue";
import TreeSlot from "@/components/TreeSlot";
import {
  pageAllClassify,
  pageMyselfUse,
  getDeviceKindTree,
} from "@/api/equipment";
export default {
  name: "DeviceSelectionDialog",
  components: {
    LeadalTable,
    TreeSlot,
  },
  inject: ["root"],
  props: {
    equipmentTab: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      config:{
        pageSize:10,
        currentPage:1,
        total:0
      },
      drawerTitle: this.root.drawerTitle,
      form: {
        content: "", //输入框
        categoryLabel: "", //设备分类名称
        categoryId: "", //设别分类
        tab: this.equipmentTab, //设备标签
      },
      tabOptions: this.$store.state.login.equipmentTab,
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "code", label: "保密系统编号" },
          { value: "categoryLabel", label: "设备分类" },
          { value: "brand", label: "设备品牌" },
          { value: "model", label: "设备型号" },
          { value: "sn", label: "序列号" },
          { value: "ownerOrganName", label: "存放位置" },
          { value: "secretLabel", label: "设备密级" },
          { value: "status", label: "设备状态" },
        ],
        loading: false,
      },
      selection: [],
      defaultProps: {
        children: "children",
        label: "caption",
      },
      treeData: [], //设备分类树
      nodeCount: 0,
    };
  },
  created() {
    this.getData();
    this.getDeviceKindTreeData();
  },
  methods: {
    pageChange(currentPage,pageSize){
      this.config.currentPage = currentPage
      this.config.pageSize = pageSize
      this.getData()
    },
    getData() {
      console.log(this.form,'form')
      if(!this.form.categoryLabel){
        this.form.categoryId = ''
      }
      const params = {
        currentPage: this.config.currentPage,
        pageSize: this.config.pageSize,
        userId: this.$store.state.login.loginData.userId,
        ...this.form,
      };
      if (this.drawerTitle === "设备借用") {
        this.getDeviceData(pageAllClassify(params));
      } else if (this.drawerTitle === "设备移交") {
        params.classify = 4;
        this.getDeviceData(pageMyselfUse(params));
      } else {
        this.getDeviceData(pageMyselfUse(params));
      }
    },

    async getDeviceData(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        console.log('resmmmm',res)
        this.config = res.data.config
        this.tableObj.tableData = res.data.data.map((item) => {
          item.status = this.switchStatus(item.status);
          item.categoryLabel = item.categoryLabel
            ? item.categoryLabel
            : item.kindLabel;
          return item;
        });
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    switchStatus(num) {
      switch (num) {
        case 1:
          return "登记中";
        case 2:
          return "已入库";
        case 4:
          return "已登记";
        case 16:
          return "已报废";
        case 32:
          return "已销毁";
        case 64:
          return "已借用";
        case 128:
          return "已维修";
        case 256:
          return "已外送";
        case 512:
          return "已回执";
      }
    },

    //设备分类
    async getDeviceKindTreeData() {
      const res = await getDeviceKindTree({ type: 1 });
      this.treeData = res.data;
    },

    //选择分类
    handleNodeClick(node) {
      this.nodeCount++;
      if (this.nodeCount === 2) {
        this.$refs["el-select"].blur();
      }
      this.nodeTimer = setTimeout(() => {
        //300ms内没有第二次点击就把第一次点击的清空
        this.nodeCount = 0;
      }, 300);
      // this.$refs["el-select"].blur();
      this.form.categoryLabel = node.caption;
      this.form.categoryId = node.id;
      this.getData();
    },

    //选择设备
    selectDevice() {
      this.$emit("selectDevice", this.selection);
    },
  },
};
</script>

<style lang="scss" src="./headerScss.scss" scoped >
</style>

