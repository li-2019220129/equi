<template>
  <div>
    <div class="borrow-file-title">
      正文
      <el-upload
        style="display: inline-block; margin-left: 100px"
        :show-file-list="false"
        :http-request="handleUpload"
        class="upload-demo"
        action
        accept=".doc"
      >
        <el-button size="small">上传</el-button>
      </el-upload>
    </div>
    <div class="borrow-file-main">
      <el-scrollbar style="height: 200px">
        <div
          @click="pdfClick(item.id)"
          v-for="(item,index) in mainList"
          :key="index"
          class="list-item"
        >
          <span>{{index+1}}，{{item.fileName}}</span>
          <div class="icon">
            <i @click.stop="downClick(item)" class="el-icon-download icon-i"></i>
            <i @click.stop="deleteClick(item)" class="el-icon-delete-solid icon-i"></i>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="borrow-file-title">
      附件
      <el-upload
        style="display: inline-block; margin-left: 100px"
        :show-file-list="false"
        :http-request="handleUploadanner"
        class="upload-demo"
        action
        accept=".doc"
      >
        <el-button size="small">上传</el-button>
      </el-upload>
    </div>
    <div class="borrow-file-main">
      <el-scrollbar style="height: 200px">
        <div
          @click="pdfClick(item.id)"
          v-for="(item,index) in annexList"
          :key="index"
          class="list-item"
        >
          <span>{{index+1}}，{{item.fileName}}</span>
          <div class="icon">
            <i @click.stop="downClick(item)" class="el-icon-download icon-i"></i>
            <i @click.stop="deleteClick(item)" class="el-icon-delete-solid icon-i"></i>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  uploadApi,
  templateApi,
  downLoadApi,
  deleteFileApi,
  downLoadPDFApi
} from "@/api/equipment/index";
import {
  mucuploadApi,
  muctemplateApi,
  mucdownLoadApi,
  mucdeleteFileApi
} from "@/api/data/index";
export default {
  name: "BorrowFile",
  props: {
    id: {
      type: String,
      default: ""
    },
    applyId: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "设备"
    }
  },
  data() {
    return {
      mainList: [],
      annexList: [],
      upId: null,
      pdfSrc: null,
      showId: null
    };
  },
  mounted() {
    this.upId = this.applyId || this.id;
    this.getList();
  },
  methods: {
    pdfClick(id) {
      this.downLoadPdf(id);
    },
    async downLoadPdf(id) {
      const res = await downLoadPDFApi(id);
      let blob = new Blob([res], {
        type: "application/vnd.ms-pdf"
      });
      this.pdfSrc = URL.createObjectURL(blob);
      this.showId = id;
      //   let a = document.createElement("a");
      // a.href = this.pdfSrc;
      // a.download = `1.pdf`
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      this.$emit("pdfSrcSuccess", this.pdfSrc);
    },
    deleteClick(item) {
      this.$confirm("此操作将永久删除流程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { status } = await (this.mode === "设备"
            ? deleteFileApi(item.id)
            : mucdeleteFileApi(item.id));
          if (status === 200) {
            this.$message.success("删除成功！");
            this.getList();
            if (this.showId === item.id) {
              this.$emit("pdfSrcDelete");
            }
          }
        })
        .catch(() => {
          this.$message.warning("已取消");
        });
    },
    async downClick(item) {
      const res = await (this.mode === "设备"
        ? downLoadApi(item.id)
        : mucdownLoadApi(item.id));
      let blob = new Blob([res], {
        type: "application/msword"
      });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${item.fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    async getList() {
      const { status, data } = await (this.mode === "设备"
        ? templateApi(this.upId)
        : muctemplateApi(this.upId));
      if (status == 200) {
        this.mainList = data.filter(item => item.type === 1);
        this.annexList = data.filter(item => item.type === 2);
      }
    },
    async handleUpload(file) {
      let formData = new FormData();
      console.log(file.file, "9999");
      formData.append("uploadFile", file.file);
      const { status, data } = await (this.mode === "设备"
        ? uploadApi(this.upId, 1, formData)
        : mucuploadApi(this.upId, 1, formData));
      console.log(status, "909090");
      if (status == 200) {
        this.$message.success("上传成功！");
        this.downLoadPdf(data);
        this.getList();
      }
    },
    async handleUploadanner(file) {
      let formData = new FormData();
      console.log(file.file, "9999");
      formData.append("uploadFile", file.file);
      const { status, data } = await (this.mode === "设备"
        ? uploadApi(this.upId, 2, formData)
        : mucuploadApi(this.upId, 2, formData));
      if (status == 200) {
        this.$message.success("上传成功！");
        this.downLoadPdf(data);
        this.getList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden !important;
}

::v-deep .el-upload {
  width: 80px;
}
::v-deep .el-button--default {
  width: 80px;
}
.list-item {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  padding: 0 30px;
  margin-top: 10px;
  align-items: center;
  cursor: pointer;
  background-color: rgba(237, 249, 255);
  .icon {
    width: 70px;
    display: flex;
    justify-content: space-around;
    .icon-i {
      font-size: 20px;
      color: rgba(90, 107, 115);
      cursor: pointer;
    }
  }
}
.borrow-file-title {
  position: relative;
  font-family: SourceHanSansCN-Medium;
  font-size: 22px;
  height: 50px;
  line-height: 40px;
  margin: 10px 0;
  padding: 0 0 0 20px;
  box-sizing: border-box;
  color: #3d464c;
  letter-spacing: 0;
  font-weight: 500;
}
.borrow-file-title::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 3px;
  width: 3px;
  height: 36px;
  background-color: #027db4;
}
.borrow-file-main {
  height: 200px;
}
</style>
