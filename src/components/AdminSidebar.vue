<template>
  <div :class="['admin-sidebar', { collapsed: isCollapsed }]">
    <button class="sidebar-toggle" @click="toggleSidebar">
      {{ isCollapsed ? '展开' : '收起' }}
    </button>

    <ul>
      <li
        v-for="item in mainMenu"
        :key="item.key"
        :class="{ active: current === item.key }"
        :title="item.label"
        @click="$emit('navigate', item.key)"
      >
        <span class="menu-label">{{ isCollapsed ? item.shortLabel : item.label }}</span>
      </li>
    </ul>

    <ul class="bottom-menu">
      <li
        v-for="item in bottomMenu"
        :key="item.key"
        :class="{ active: current === item.key }"
        :title="item.label"
        @click="$emit('navigate', item.key)"
      >
        <span class="menu-label">{{ isCollapsed ? item.shortLabel : item.label }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "AdminSidebar",
  data() {
    return {
      isCollapsed: false,
      mainMenu: [
        { key: "verify", label: "验证码查询", shortLabel: "验" },
        { key: "report", label: "Allure测试报告", shortLabel: "报" },
        { key: "home", label: "jenkins", shortLabel: "J" },
        { key: "users", label: "用户管理", shortLabel: "用" },
        { key: "settings", label: "设置", shortLabel: "设" }
      ],
      bottomMenu: [
        { key: "log", label: "系统日志", shortLabel: "日" },
        { key: "stats", label: "数据统计", shortLabel: "统" },
        { key: "lucky-draw", label: "抽奖功能", shortLabel: "抽" }
      ]
    };
  },
  props: {
    current: {
      type: String,
      default: "home"
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>
<style scoped>
.admin-sidebar {
  width: 170px;
  background:#f7f7f7;
  padding:12px;
  border-right:1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: width 0.22s ease, padding 0.22s ease;
}

.admin-sidebar.collapsed {
  width: 76px;
  padding: 12px 8px;
}

.sidebar-toggle {
  margin-bottom: 12px;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  background: #24292e;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}

.admin-sidebar ul{list-style:none;padding:0;margin:0}

.admin-sidebar li{
  padding:10px 12px;
  cursor:pointer;
  border-radius:4px;
  margin-bottom: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.admin-sidebar.collapsed li {
  padding: 10px 0;
  text-align: center;
}

.menu-label {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-sidebar li.active{background:#007aff;color:#fff}
.bottom-menu {
  margin-top: auto;
}
</style>