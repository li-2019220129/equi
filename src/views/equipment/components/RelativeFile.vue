<template>
  <div>
    <div class="borrow-file-title">
      正文
      <el-upload
        style="display: inline-block; margin-left: 100px"
        :show-file-list="false"
        :http-request="handleUpload"
        class="upload-demo"
        action=""
      >
        <el-button size="small">上传</el-button>
      </el-upload>
    </div>
    <div class="borrow-file-main">
      <el-scrollbar style="height: 200px">
        <div class="list-item">
          <span>1.设备借用申请单</span>
          <div class="icon">
            <i class="el-icon-download icon-i"></i>
            <i class="el-icon-delete-solid icon-i"></i>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="borrow-file-title">
      附件
      <el-upload
        style="display: inline-block; margin-left: 100px"
        :show-file-list="false"
        :http-request="handleUpload"
        class="upload-demo"
        action=""
      >
        <el-button size="small">上传</el-button>
      </el-upload>
    </div>
    <div class="borrow-file-main">
      <el-scrollbar style="height: 200px">
        <div class="list-item">
          <span>1.设备借用申请单</span>
          <div class="icon">
            <i class="el-icon-download icon-i"></i>
            <i class="el-icon-delete-solid icon-i"></i>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <!-- <div>
    <div class="borrow-file-title">
      正文
      <el-upload
        style="display: inline-block; margin-left: 100px"
        :show-file-list="false"
        :http-request="handleUpload"
        class="upload-demo"
        action=""
      >
        <el-button size="small">上传</el-button>
      </el-upload>
    </div>
    <div class="borrow-file-main"></div>
    <div class="borrow-file-title">
      附件
      <el-upload
        style="display: inline-block; margin-left: 100px"
        :show-file-list="false"
        :http-request="handleUpload"
        class="upload-demo"
        action=""
      >
        <el-button size="small">上传</el-button>
      </el-upload>
    </div>
  </div> -->
</template>

<script>
export default {
  name: "BorrowFile",
  methods: {
    handleUpload() {},
  },
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
  align-items: center;
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
