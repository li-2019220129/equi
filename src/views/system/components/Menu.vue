<template>
  <div class="menu-container">
    <div class="equipment-header">
      <div class="table-menu-item selected">菜单权限</div>
      <el-switch v-model="allMenu" active-text="全启" @change="allChange">
      </el-switch>
    </div>

    <leadal-table
      :data="tableObj.tableData"
      :row-header="tableObj.tableOptions"
      :isPagination="true"
      :total="tableObj.total"
      :page="tableObj.page"
      :size="tableObj.size"
      v-loading="tableObj.loading"
      @page-change="handleChangePage"
      :height="'calc(75vh)'"
      ref="leadalTable"
    >
      <template slot="app">
        <el-table-column
          label="应用模块"
          prop="menu"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.menu.name }}
          </template>
        </el-table-column>
      </template>

      <template slot="enabled">
        <el-table-column label="应用功能" prop="childMenus" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="
                (val) => {
                  handleChooseAll(val, scope.row);
                }
              "
              v-model="scope.row.isAll"
              style="margin-right: 48px"
              active-text="全启"
            >
            </el-switch>
          </template>
        </el-table-column>
      </template>

      <template slot="select">
        <el-table-column
          label=""
          header-align="center"
          align="left"
          min-width="600"
        >
          <template slot-scope="scope">
            <el-checkbox-group
              @change="handleEnabled(scope.row)"
              v-model="scope.row.enabledArray"
            >
              <el-checkbox
                v-for="{ id, name } in scope.row.childMenus"
                :label="id"
                :key="id"
                >{{ name }}</el-checkbox
              >
            </el-checkbox-group>
          </template>
        </el-table-column>
      </template>
    </leadal-table>
  </div>
</template>

<script>
import LeadalTable from "@/components/LeadalTable/index.vue";
import {
  allEnableApi,
  allEnableRoleApi,
  menuOnUseApi,
  menuPage,
} from "@/api/system/index";
export default {
  name: "MenuRole",
  components: {
    LeadalTable,
  },
  props: {
    mode: String,
    menuData: Array,
    currentRow: Object,
    isAll: Boolean,
  },
  data() {
    return {
      tableObj: {
        tableData: [],
        tableOptions: [
          { type: "index", label: "序号" },
          { type: "slot", name: "app" },
          { type: "slot", name: "enabled" },
          { type: "slot", name: "select" },
        ],
        loading: false,
        page: 1,
        size: 10,
        total: 0,
      },
      allMenu: true,
      checkedCities: ["上海", "北京"],
    };
  },
  watch: {
    menuData() {
      if (this.mode === "component") {
        this.tableObj.loading = true;
        this.tableObj.tableData = this.menuData ?? [];
        this.tableObj.loading = false;
      }
    },
    isAll() {
      if (this.mode === "component") {
        this.all = this.isAll;
      }
    },
  },
  created() {
    if (this.mode === "component") {
      this.tableObj.tableData = this.menuData ?? [];
      if (this.currentRow) {
        this.all = this.currentRow.flag;
      }
      return;
    }
    this.loadTableData();
  },
  methods: {
    //分页切换
    handleChangePage(pageNum, pageSize) {
      this.tableObj.page = pageNum;
      this.tableObj.size = pageSize;
      this.getData();
    },
    enabled(row) {
      return row.childMenus
        .filter((r) => r.enabled)
        .map((r) => {
          return r.id;
        });
    },
    allChange(val) {
      if (this.mode === "component") {
        allEnableRoleApi({ flag: val, roleId: this.currentRow.id }).then(
          (res) => {
            if (res.status === 200) {
              this.$emit("refresh");
              this.$message.success("操作成功！");
            }
          }
        );
        return;
      }
      allEnableApi({ enable: val }).then((res) => {
        if (res.status === 200) {
          this.$message.success("操作成功！");
          this.loadTableData();
        }
      });
    },
    boolFormatter(data) {
      return data.enabled ? "是" : "否";
    },
    loadTableData() {
      menuPage().then((res) => {
        if (res.status === 200) {
          this.tableObj.tableData = res.data.children.map((r) => {
            const enabledArray = this.enabled(r);
            return {
              ...r,
              enabledArray,
              isAll: r.childMenus.length === enabledArray.length,
            };
          });
          this.all = res.data.flag;
        }
      });
    },
    handleChooseAll(val, row) {
      if (val) {
        row.enabledArray = row.childMenus.map((r) => {
          return r.id;
        });
      } else {
        row.enabledArray = [];
      }
      const array = row.childMenus.map((r) => {
        return { id: r.id, enabled: row.enabledArray.indexOf(r.id) !== -1 };
      });
      if (this.mode === "component") {
        this.$emit("handleEnbled", array);
        return;
      }

      menuOnUseApi({ childMenus: array }).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.msg);
          this.$store.dispatch("login/userAuth");
          this.loadTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleEnabled(row) {
      row.isAll = row.childMenus.length === row.enabledArray.length;
      const array = row.childMenus.map((r) => {
        return { id: r.id, enabled: row.enabledArray.indexOf(r.id) !== -1 };
      });

      if (this.mode === "component") {
        this.$emit("handleEnbled", array);
        return;
      }

      menuOnUseApi({ childMenus: array }).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.msg);
          this.loadTableData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 70px;
  margin-right: 50px;
}
.leadel-line {
  border: 1px solid #b4b4b4;
}
</style>
