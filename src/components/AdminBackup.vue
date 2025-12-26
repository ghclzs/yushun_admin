<template>
  <div class="admin-backup">
    <h2>备份恢复</h2>
    <p>管理系统数据备份和恢复。</p>
    <div class="backup-content">
      <button>创建备份</button>
      <button>恢复备份</button>
      <div class="backup-list">
        <h3>备份历史</h3>
        <ul>
          <li>2025-12-26 备份1</li>
          <li>2025-12-25 备份2</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminBackup"
};
</script>
<style scoped>
.admin-backup {
  padding: 16px;
}
.backup-content {
  margin-top: 16px;
}
button {
  padding: 8px 16px;
  margin-right: 8px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.backup-list {
  margin-top: 16px;
}
.backup-list ul {
  list-style: none;
  padding: 0;
}
.backup-list li {
  padding: 8px;
  background: #f9f9f9;
  margin-bottom: 4px;
  border-radius: 4px;
}
</style>