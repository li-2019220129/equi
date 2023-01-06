<template>
  <div>
    <div class="drawer-header">
      <div class="drawer-header title">资料审批流程{{ title }}</div>
      <div class="equipment-button">
        <div class="equipment-button_btn" @click="save">
          <img src="@/assets/icon/保存@2x.png" />
          <span>完成配置</span>
        </div>
      </div>
    </div>
    <el-form
      inline
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="right"
      style="margin: 30px 0"
      ref="form"
    >
      <el-form-item label="流程名称" prop="name" style="margin-right: 50px; margin-left: 15px">
        <el-input v-model="form.name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="应用模块" prop="categoryValue">
        <el-select v-model="form.categoryValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in categoryValueList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密级" prop="secret">
        <el-select v-model="form.secret" placeholder="请选择密级" multiple clearable>
          <el-option
            style="height: auto; width: 100%"
            v-for="item in secretOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable" style="margin-left: 20px">
        <el-switch v-model="form.enable"></el-switch>
      </el-form-item>
    </el-form>
    <div class="drawer-form-title">审批节点配置</div>
    <div style="padding: 32px 12px" class="node-editor">
      <div style="flex: 0.8; display: flex">
        <data-node
          @addNode="addNode"
          v-for="(item, index) in nodes"
          :title="item.title"
          :defaultArray="item.id"
          :id="item.userId"
          :key="item.key"
          :index="index"
          @removeNode="removeNode"
          @change="changeNode"
          :type="type"
          :nodes="nodes"
        />
      </div>
      <div class="end">
        <div class="full-node" style="margin-right: 0">
          <div class="arrow-box dark" @click="addNodeLast({ index: nodes.length })">
            <div style="width: 78px; cursor: pointer">+{{ type === "tome" ? "添加" : "节点" }}</div>
            <div class="el-icon-arrow-right" style="margin-top: 2px; cursor: pointer"></div>
          </div>
          <div class="end-node-out">
            <div class="end-node"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="out-line"></div>
  </div>
</template>

<script>
import DataNode from "./DataNode.vue";
import { saveFlow,  flowUpdate} from "@/api/data";
export default {
  name: "FlowEditor",
  components: {
    DataNode
  },
  props: {
    type: { type: String, default: "node" },
    title: {
      type: String,
      default: "新增"
    },
    editNodes: {
      type: Array,
      default: () => []
    },
    editForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      nodes: [
        {
          title: "请选择",
          id: "",
          key: ""
        }
      ],
      form: {
        name: "",
        categoryValue: "",
        enable: true,
        flowIds: "",
        secret: []
      },
      secretOptions: this.$store.state.login.equipmentSecret,
      categoryValueList: [
        {
          id: 1,
          label: "资料登记"
        },

        {
          id: 32,
          label: "资料移交"
        },
        {
          id: 4,
          label: "资料外送"
        },
        {
          id: 64,
          label: "资料销毁"
        },
        {
          id: 128,
          label: "资料借阅"
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
        categoryValue: [
          { required: true, message: "请输入应用模块", trigger: "blur" }
        ],
        secret: [{ required: true, message: "请选择密级", trigger: "blur" }],
        enable: [{ required: true, message: "请选择是否启用", trigger: "blur" }]
      }
    };
  },
  created() {},

  watch: {
    editForm: {
      immediate: true,
      handler(val) {
        if (JSON.stringify(val !== "{}")) {
          Object.assign(this.form, val);
          //字符串数组转整形数组
          this.form.secret = val.secret.split(",").map(item => +item);
          this.form.flowIds = val.id;
        } else {
          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });
        }
      }
    },
    editNodes: {
      // immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.nodes = [...val];
        }
      }
    }
  },
  methods: {
    changeNode(user, index) {
      const { participatorList } = user;
      const id = participatorList.map(item => item.userId);
      const userId = participatorList.map(item => item.userId).join(",");
      const userName = participatorList.map(item => item.userName).join(",");
      this.nodes = this.nodes.map((r, i) => {
        if (i === index) {
          return {
            ...user,
            key: r.key,
            id: id,
            userId: userId,
            title: userName,
            participatorList: participatorList
          };
        }
        return { ...r };
      });
    },
    addNodeLast() {
      this.nodes = [
        ...this.nodes,
        {
          title: "请选择",
          key: `${this.nodes.length}o${Math.random() % 10009}`,
          participatorList: []
        }
      ];
    },
    addNode({ index }) {
      const array = [];
      this.nodes.forEach((node, i) => {
        if (i === index) {
          array.push({
            title: "请选择",
            key: `${i}o${Math.random() % 10009}`
          });
          array.push(node);
        } else {
          array.push(node);
        }
      });
      this.nodes = array;
    },
    removeNode({ index }) {
      const array = [...this.nodes];
      array.splice(index, 1);
      if (array.length === 0) {
        this.$message.error("流程最少要有一个节点！");
        return;
      }
      this.nodes = array;
    },

    //保存配置
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const array = this.nodes.filter(r => !r.userId);
          if (array.length > 0 || this.nodes.length === 0) {
            this.$message.error("请选择审批人！");
            return;
          }
          const sercet = this.form.secret.join(",");

          const secretLabel = this.secretOptions.filter(item =>
            this.form.secret.some(it => item.value === it)
          );

          const label = secretLabel.map(item => item.name).join(",");

          this.form.secret = sercet;
           this.$set(this.form, "secretLabel", label);
          const params = {
            ...this.form,
            nodeViews: this.nodes.map(r => {
              return {
                participatorList: r.participatorList
              };
            })
          };
          this.editNodes.length === 0
            ? this.saveOrUpdate(saveFlow(params))
            : this.saveOrUpdate(flowUpdate(params));
        }
      });
    },
    async saveOrUpdate(promise) {
      const res = await promise;
      this.$message.success(res.msg);
      this.$emit("closeDrawer");
    }
  }
};
</script>

<style lang="scss" scoped>
.node-editor {
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
}
.node-bottom {
  display: flex;
  justify-content: flex-start;
}
.out-line {
  background: #f6f6f6;
  height: 4px;
  height: 4px;
  margin-left: 75px;
  margin-top: -45px;
  margin-right: 60px;
}
.full-node {
  text-align: center;
  width: 100px;
  font-size: 14px;
  margin-right: 64px;
}
.node {
  width: 16px;
  height: 16px;
  color: white;
  background: #00a0f0;
  border-radius: 50%;
  //   margin: 5px 0 0 5px;
  cursor: pointer;
}
.node-out {
  width: 26px;
  height: 26px;
  text-align: center;
  border-radius: 50%;
  background: #00a0f030;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 37px;
  margin-top: 16px;
}
.node-out:hover {
  background: #00a0f060;
}
.arrow-box {
  display: flex;
  justify-content: flex-end;
  color: white;
  padding: 12px 2px 12px 12px;
  height: 40px;
  position: relative;
  background: #00a0f0;
  border-radius: 2px;
  // border: 4px solid #c2e1f5;
}
.arrow-box:hover {
  color: rgba(255, 255, 255, 0.692);
}
.arrow-box:after,
.arrow-box:before {
  top: 100%;
  left: 70%;
  border: solid transparent;
  content: " ";
  position: absolute;
  pointer-events: none;
}

.arrow-box:after {
  border-color: rgba(136, 183, 213, 0);
  border-top-color: #00a0f0;
  border-width: 10px;
  margin-left: -30px;
}
.dark {
  background: black;
}
.dark:after {
  border-top-color: black;
}
// .arrow-box:before {
//   border-color: rgba(194, 225, 245, 0);
//   border-top-color: #c2e1f5;
//   border-width: 16px;
//   margin-left: -36px;
// }
.end-node {
  width: 16px;
  height: 16px;
  color: white;
  background: #333333;
  border-radius: 50%;
  //   margin: 5px 0 0 5px;
}
.end-node-out {
  width: 26px;
  height: 26px;
  text-align: center;
  border-radius: 50%;
  background: #33333330;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 37px;
  margin-top: 16px;
}
.end {
  flex: 0.2;
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-badge__content {
  background-color: #f56c6c;
  border-radius: 50%;
  color: #ffffff;
  display: inline-block;
  font-size: 10px;
  height: 18px;
  line-height: 18px;
  padding: 0 3px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #ffffff;
  cursor: pointer;
}
::v-deep.el-badge__content:hover {
  background-color: #f56c6c81;
}
.drawer-form-title {
  font-family: SourceHanSansCN-Medium;
  font-size: 18px;
  margin: 10px 0;
  color: #3d464c;
  letter-spacing: 0;
  font-weight: 400;
}
</style>
