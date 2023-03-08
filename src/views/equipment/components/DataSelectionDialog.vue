<template>
  <div>
    <div class="dialog-btn-layout">
      <div class="handle sure" @click="selectData">选择确认</div>
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
      <el-form-item label>
         <el-input
          v-model="form.content"
          style="width: 310px"
          placeholder="请输入标题/编号/关键字"
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

      <el-form-item label>
         <el-input
          v-model="form.ownerDeptName"
          style="width: 310px"
          placeholder="请输入所在机构"
          @keyup.enter.native="getData"
        >
          <i
            slot="suffix"
            style="cursor: pointer"
            class="el-input__icon el-icon-search"
            @click="getData"
          ></i>
        </el-input>
        <!-- <el-select v-model="form.ownerDeptName" style="width: 220px" placeholder="请选择所在机构">
          <el-option style="height: auto"></el-option>
        </el-select>-->
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
      :selection.sync="selection"
      ref="leadalTable"
      :height="'calc(100vh - 600px)'"
      @page-change="pageChange"
    ></leadal-table>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable/index.vue";
import { pageSafeMedia, pageValidMedia } from "@/api/data/index";
export default {
  components: {
    LeadalTable
  },
  inject: ["root"],
  data() {
    return {
      config: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      drawerTitle: this.root.drawerTitle,
      form: { content: "", ownerDeptName: "" },
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "selection" },
          { type: "index", label: "序号" },
          { value: "heading", label: "文件标题" },
          { value: "code", label: "文件编号" },
          { value: "ownerDeptName", label: "所在机构" },
          { value: "keepUserName", label: "责任人" },
          { value: "secretLevelLabel", label: "资料密级" }
        ],
        page: 1,
        size: 10,
        loading: false
      },
      selection: [] //选中数据
    };
  },
  created() {
    this.getData();
  },
  methods: {
    pageChange(currentPage, pageSize) {
      this.config.currentPage = currentPage;
      this.config.pageSize = pageSize;
      this.getData();
    },
    getData() {
      const params = {
        currentPage: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.form
      };
      if (this.drawerTitle === "资料借阅") {
        this.getDataByType(pageSafeMedia(params));
      } else {
        params.ownerUserId = this.$store.state.login.loginData.userId;
        this.getDataByType(pageValidMedia(params));
      }
    },

    async getDataByType(promise) {
      try {
        this.tableObj.loading = true;
        const res = await promise;
        this.config = res.data.config;
        this.tableObj.tableData = res.data.data;
        this.tableObj.loading = false;
      } catch (error) {
        this.tableObj.loading = false;
      }
    },

    //选择资料
    selectData() {
      this.$emit("selectData", this.selection);
    }
  }
};
</script>

<style lang="scss" src="./headerScss.scss" scoped >
</style>
