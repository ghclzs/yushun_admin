<template>
  <div class="admin-sidebar">
    <ul>
      <li :class="{active: current === 'verify'}" @click="$emit('navigate','verify')">验证码查询</li>
      <li :class="{active: current === 'report'}" @click="$emit('navigate','report')">测试报告</li>
      <li :class="{active: current === 'home'}" @click="$emit('navigate','home')">仪表盘</li>
      <li :class="{active: current === 'users'}" @click="$emit('navigate','users')">用户管理</li>
      <li :class="{active: current === 'settings'}" @click="$emit('navigate','settings')">设置</li>
    </ul>
    <ul class="bottom-menu">
      <li :class="{active: current === 'log'}" @click="$emit('navigate','log')">系统日志</li>
      <li :class="{active: current === 'stats'}" @click="$emit('navigate','stats')">数据统计</li>
      <li :class="{active: current === 'backup'}" @click="$emit('navigate','backup')">备份恢复</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "AdminSidebar",
  props: {
    current: {
      type: String,
      default: "home"
    }
  }
};
</script>
<style scoped>
.admin-sidebar {
  background:#f7f7f7;
  padding:12px;
  border-right:1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.admin-sidebar ul{list-style:none;padding:0;margin:0}
.admin-sidebar li{padding:10px 12px;cursor:pointer;border-radius:4px}
.admin-sidebar li.active{background:#007aff;color:#fff}
.bottom-menu {
  margin-top: auto;
}
</style>