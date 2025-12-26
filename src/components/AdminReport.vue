<template>
  <div class="admin-report">
    <h2>测试报告</h2>
    <p>这里显示测试报告内容。</p>
    <div class="report-content">
      <h3>报告摘要</h3>
      <ul>
        <li>总测试数: 100</li>
        <li>通过: 95</li>
        <li>失败: 5</li>
        <li>成功率: 95%</li>
      </ul>
      <h3>详细结果</h3>
      <table>
        <thead>
          <tr>
            <th>测试名称</th>
            <th>状态</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>登录测试</td>
            <td>通过</td>
            <td>1.2s</td>
          </tr>
          <tr>
            <td>验证码查询测试</td>
            <td>通过</td>
            <td>0.8s</td>
          </tr>
          <!-- 添加更多行 -->
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminReport"
};
</script>
<style scoped>
.admin-report {
  padding: 16px;
}
.report-content {
  margin-top: 16px;
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