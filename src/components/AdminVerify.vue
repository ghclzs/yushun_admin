<template>
  <div class="admin-verify">
    <h2>验证码查询</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="type">类型:</label>
        <select id="type" v-model="form.type" required>
          <option value="app">app</option>
          <option value="edu_b">edu_b</option>
          <option value="edu_c">edu_c</option>
        </select>
      </div>
      <div class="form-group">
        <label for="phone">手机号:</label>
        <input id="phone" type="text" v-model="form.phone" placeholder="请输入手机号" required />
      </div>
      <button type="submit" :disabled="loading">查询</button>
    </form>
    <div v-if="result" class="result">
      <h3>结果:</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: "AdminVerify",
  data() {
    return {
      form: {
        type: 'app',
        phone: ''
      },
      loading: false,
      result: null,
      error: null
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.error = null;
      this.result = null;
      try {
        const response = await axios.get('http://8.129.86.105:5000/code/login_code', {
          params: {
            phone: this.form.phone,
            type: this.form.type
          }
        });
        this.result = response.data;
      } catch (err) {
        this.error = err.response ? err.response.data : err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped>
.admin-verify {
  padding: 16px;
}
.form-group {
  margin-bottom: 12px;
}
label {
  display: block;
  margin-bottom: 4px;
}
select, input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 16px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
}
.result, .error {
  margin-top: 16px;
}
.error {
  color: red;
}
</style>