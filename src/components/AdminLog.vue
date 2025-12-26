<template>
  <div class="admin-log">
    <h2>系统日志</h2>
    <p>查看系统运行日志。</p>
    <div class="log-content">
      <textarea readonly rows="20" cols="80">
[2025-12-26 10:00:00] 系统启动成功
[2025-12-26 10:05:00] 用户登录: admin
[2025-12-26 10:10:00] 验证码查询请求
[2025-12-26 10:15:00] 测试报告生成
      </textarea>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminLog"
};
</script>
<style scoped>
.admin-log {
  padding: 16px;
}
.log-content {
  margin-top: 16px;
}
textarea {
  width: 100%;
  font-family: monospace;
}
</style>