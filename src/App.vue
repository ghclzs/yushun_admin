<template>
  <div id="app" class="admin-root">
    <header class="admin-top">钰顺测试管理平台</header>
    <div class="admin-body">
      <AdminSidebar :current="currentPage" @navigate="handleNavigate" />
      <main class="admin-main">
        <AdminHome v-if="currentPage === 'home'" />
        <AdminUsers v-else-if="currentPage === 'users'" />
        <AdminSettings v-else-if="currentPage === 'settings'" />
        <AdminVerify v-else-if="currentPage === 'verify'" />
        <AdminReport v-else-if="currentPage === 'report'" />
        <AdminLog v-else-if="currentPage === 'log'" />
        <AdminStats v-else-if="currentPage === 'stats'" />
        <LuckyDrawWheel v-else-if="currentPage === 'lucky-draw'" />
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
import LuckyDrawWheel from "./components/LuckyDrawWheel.vue";

export default {
  name: "App",
  components: { AdminSidebar, AdminHome, AdminUsers, AdminSettings, AdminVerify, AdminReport, AdminLog, AdminStats, LuckyDrawWheel },
  data() {
    return { currentPage: "verify" };
  },
  created() {
    this.currentPage = this.resolvePageFromRoute(this.$route);
  },
  watch: {
    $route(to) {
      this.currentPage = this.resolvePageFromRoute(to);
    }
  },
  methods: {
    resolvePageFromRoute(route) {
      if (!route || !route.path) {
        return "verify";
      }

      if (["/lucky-draw", "/new-lucky-draw", "/lucky-draw-tab"].includes(route.path)) {
        return "lucky-draw";
      }

      return this.currentPage || "verify";
    },
    handleNavigate(page) {
      this.currentPage = page;

      if (!this.$router) {
        return;
      }

      const targetPath = page === "lucky-draw" ? "/lucky-draw" : "/";
      if (this.$route.path === targetPath) {
        return;
      }

      this.$router.push(targetPath).catch(function() {});
    }
  }
};
</script>
<style>
.admin-top{background:#24292e;color:#fff;padding:12px 16px;font-size:16px}
.admin-body{display:flex;align-items:flex-start}
.admin-main{flex:1;padding:16px;background:#fff;min-height:400px}
</style>
