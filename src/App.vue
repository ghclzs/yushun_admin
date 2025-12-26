<template>
  <div id="app" class="admin-root">
    <header class="admin-top">钰顺测试管理平台</header>
    <div class="admin-body">
      <AdminSidebar :current="currentPage" @navigate="currentPage = $event" />
      <main class="admin-main">
        <AdminHome v-if="currentPage === 'home'" />
        <AdminUsers v-else-if="currentPage === 'users'" />
        <AdminSettings v-else-if="currentPage === 'settings'" />
        <AdminVerify v-else-if="currentPage === 'verify'" />
        <AdminReport v-else-if="currentPage === 'report'" />
        <AdminLog v-else-if="currentPage === 'log'" />
        <AdminStats v-else-if="currentPage === 'stats'" />
        <AdminBackup v-else-if="currentPage === 'backup'" />
      </main>
    </div>
  </div>
</template>
<script>
import AdminSidebar from "./components/AdminSidebar.vue";
import AdminHome from "./components/AdminHome.vue";
import AdminUsers from "./components/AdminUsers.vue";
import AdminSettings from "./components/AdminSettings.vue";
import AdminVerify from "./components/AdminVerify.vue";
import AdminReport from "./components/AdminReport.vue";
import AdminLog from "./components/AdminLog.vue";
import AdminStats from "./components/AdminStats.vue";
import AdminBackup from "./components/AdminBackup.vue";

export default {
  name: "App",
  components: { AdminSidebar, AdminHome, AdminUsers, AdminSettings, AdminVerify, AdminReport, AdminLog, AdminStats, AdminBackup },
  data() {
    return { currentPage: "verify" };
  }
};
</script>
<style>
.admin-top{background:#24292e;color:#fff;padding:12px 16px;font-size:16px}
.admin-body{display:flex;align-items:flex-start}
.admin-main{flex:1;padding:16px;background:#fff;min-height:400px}
</style>
