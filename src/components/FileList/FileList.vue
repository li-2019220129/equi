<template>
  <div class="file-list__container">
    <el-link type="primary" @click="uploadFile" v-show="uploadBtn">
      <span v-show="showXing" style="color: red; font-size: 19px; padding: 0 6px">*</span>选择附件
    </el-link>
    <input
      multiple="multiple"
      type="file"
      style="display: none"
      id="file"
      @change="handleFileInputChange"
    />
    <div v-for="(file, index) in fileList" class="file-list" :key="index">
      <div>{{ index + 1 }}、{{ file.fileName }}</div>
      <div>
        <el-link type="warning" class="link" @click="handleDelete(file)" v-show="delShow">删除</el-link>
        <el-link type="primary" class="link" @click="handlePreView(file)" v-show="previewShow">预览</el-link>
        <el-link class="link" type="success" @click="handleDownload(file)" v-show="downloadShow">下载</el-link>
      </div>
    </div>

    <whole-dialog
      :visible="dialogMate.visible"
      :title="dialogMate.title"
      @close="dialogMate.visible = false"
      width="80%"
    >
      <template #content>
        <iframe
          :src="iframeSrc"
          style="width: 100%; height: 600px; border: 0; margin: 0; padding: 0"
        ></iframe>
      </template>
    </whole-dialog>
  </div>
</template>

<script>
import {
  delFile,
  download,
  getDataList,
  upload,
  searchfStatus,
  exchangeFile
} from "@/api/no-assigned";

export default {
  name: "FileList",
  props: {
    btnType: {
      type: String,
      default: null
    },
    delShow: {
      type: Boolean,
      default: true
    },
    previewShow: {
      type: Boolean,
      default: true
    },
    downloadShow: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ""
    },
    type: {
      type: Number,
      default: null
    },
    uploadBtn: {
      type: Boolean,
      default: true
    },
    showXing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      dialogMate: {
        visible: false,
        title: ""
      },
      iframeSrc: null,
      entity: {},
      fileArr: [],
      // 设置input文件框id不唯一
      keyNum: 1
    };
  },
  watch: {
    uuid() {
      this.loadDataList();
    },
    id: {
      handler(newVal, oldVal) {
        this.id = newVal;
        if (newVal != null && newVal != "") {
          this.loadDataList();
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleDelete(file) {
      let formData = new FormData();
      formData.append("ids", `"${file.id}"`);
      delFile(formData).then(res => {
        if (res.code === 0) {
          // this.$message.success("删除成功");
          this.$message({
            type: "success",
            duration: 1000,
            message: "删除成功"
          });
          this.loadDataList();
        } else {
          // this.$message.error("删除失败");
          this.$message({
            type: "error",
            duration: 1000,
            message: "删除成功"
          });
        }
      });
      this.$emit("handleDelete", file);
    },
    async handlePreView(file) {
      this.$emit("handlePreView", file);
      this.dialogMate.visible = true;
      this.dialogMate.title = "预览";
      const fileStatus = await searchfStatus(file.id);
      if (fileStatus.code === 0 && fileStatus.isSuccess === true) {
        this.iframeSrc = `${window.location.contextPath}/leadal.basic/pdf/action.nsp?container&action=com.leadal.top.supervice.suggest.action.SFileInfoViewAction&id=${file.id}`;
      } else {
        let res = await exchangeFile(file.id);
        if (res.code === 0) {
          this.iframeSrc = `${window.location.contextPath}/leadal.basic/pdf/action.nsp?container&action=com.leadal.top.supervice.suggest.action.SFileInfoViewAction&id=${file.id}`;
        } else {
          return;
        }
      }
      // this.iframeSrc = `${window.location.contextPath}/leadal.basic/pdf/action.nsp?container&action=com.leadal.top.supervice.suggest.action.SFileInfoViewAction&id=${file.id}`;
    },
    handleDownload(file) {
      download(file.id, file.extname);
      this.$emit("handleDownload", file);
    },
    uploadFile(e) {
      // const file = document.getElementById("file");
      // 2022/2/7修改文件框获取方式,避免文件组件相互影响
      const file = this.$el.children[1];
      file.click();
    },
    // 获取文件列表
    async loadDataList() {
      await getDataList({ entityId: this.id, type: this.type }).then(res => {
        this.fileList = res.data;
        this.$emit("getFilelist", this.fileList);
      });
    },

    // 上传文件
    handleFileInputChange(e) {
      let that = this;
      function uploadPromise() {
        // let files = document.getElementById("file");
        // 2022/2/7修改文件框获取方式
        let files = that.$el.children[1];
        const formData = new FormData();
        formData.append("uploadFile", files.files[0]);
        let entity = {
          entityId: that.id,
          fileName: files.files[0].name,
          fcategory: that.type
        };
        formData.append("entity", JSON.stringify(entity));
        return new Promise((resolve, reject) => {
          upload(formData).then(res => {
            if (res.code === 0) {
              that.$message.success("文件上传成功");
              that.loadDataList();
              resolve();
            } else {
              that.$message.success("文件上传失败");
              reject();
            }
          });
          files.value = "";
        });
      }
      uploadPromise();
      this.$emit("handleFileInputChange", uploadPromise);
    },

    // 新增保存后对文件遍历长传
    fileUp() {}
  }
};
</script>

<style scoped lang="scss">
.file-list {
  display: flex;
  flex-flow: row nowrap;
  justify-content: left !important;
  .link {
    margin: 0 10px;
  }
}
</style>
<style lang="scss">
.file-list__container {
  .el-dialog__body {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
