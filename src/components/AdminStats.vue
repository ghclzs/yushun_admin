<template>
  <div class="admin-stats">
    <h2>数据统计</h2>
    <p>系统数据统计信息。</p>
    <div class="stats-content">
      <div class="stat-item">
        <h3>用户总数</h3>
        <p>1,234</p>
      </div>
      <div class="stat-item">
        <h3>今日访问</h3>
        <p>567</p>
      </div>
      <div class="stat-item">
        <h3>活跃用户</h3>
        <p>89</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminStats"
};
</script>
<style scoped>
.admin-stats {
  padding: 16px;
}
.stats-content {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}
.stat-item {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
}
.stat-item h3 {
  margin: 0 0 8px 0;
}
.stat-item p {
  font-size: 24px;
  margin: 0;
  color: #007aff;
}
</style>