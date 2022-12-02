<template>
  <div>
    <div class="borrow-file-title">正文</div>
    <div class="borrow-file-main"></div>
    <div class="borrow-file-title">附件</div>
  </div>
</template>

<script>
export default {
  name: "BorrowFile",
};
</script>

<style lang="scss" scoped>
.borrow-file-title {
  font-family: SourceHanSansCN-Medium;
  font-size: 22px;
  margin: 10px 0;
  color: #3d464c;
  letter-spacing: 0;
  font-weight: 500;
}
.borrow-file-main {
  height: 200px;
}
</style>
