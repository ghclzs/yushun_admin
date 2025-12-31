<template>
  <div class="admin-report">
    <h2>Allure测试报告</h2>
    <button @click="jumpToReport" class="jump-button">跳转到报告地址</button>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: "AdminReport",
  data() {
    return {
      reportData: '加载中...'
    };
  },
  mounted() {
    this.fetchReportData();
  },
  methods: {
    async fetchReportData() {
      try {
        const response = await axios.get('http://192.168.1.188:28545/?C=M&O=D');
        this.reportData = response.data;
      } catch (error) {
        this.reportData = '获取数据失败，请检查网络或服务器。';
      }
    },
    jumpToReport() {
      window.open('http://192.168.1.188:28545/?C=M&O=D', '_blank');
    }
  }
};
</script>
<style scoped>
.admin-report {
  padding: 16px;
}
.jump-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.jump-button:hover {
  background-color: #0056b3;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
</style>