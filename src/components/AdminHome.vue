<template>
  <div class="admin-home">
    <h2>接口自动化工程构建地址</h2>
    <p><a href="http://8.129.86.105:8887/" target="_blank">接口自动化工程构建地址</a>。</p>
    <hr>
    <h2>教培圈app 构建地址</h2>
    <p><a href="http://192.168.1.157:9880/" target="_blank">教培圈app 构建地址</a>。</p>
  </div>
</template>
<script>
export default {
  name: "AdminHome"
};
</script>
<style scoped>
.admin-home {
  padding: 12px;
}
.admin-home hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
}
.error {
  color: red;
}
</style>