<template>
  <div>
    <div class="admin-verify">
      <h2>线上验证码查询</h2>
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
          <input id="phone" type="tel" v-model="form.phone" placeholder="请输入手机号" maxlength="11" required />
        </div>
        <button type="submit" :disabled="loading">查询</button>
      </form>
      <div v-if="result" class="result">
        <h3>结果:</h3>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
    <div class="admin-verify-test">
      <h2>测试环境验证码查询</h2>
      <form @submit.prevent="testSubmitForm">
        <div class="form-group">
          <label for="test-type">类型:</label>
          <select id="test-type" v-model="testForm.type" required>
            <option value="edu_c_test">edu_c_test</option>
          </select>
        </div>
        <div class="form-group">
          <label for="test-phone">手机号:</label>
          <input id="test-phone" type="tel" v-model="testForm.phone" placeholder="请输入手机号" maxlength="11" required />
        </div>
        <button type="submit" :disabled="testLoading">查询</button>
      </form>
      <div v-if="testResult" class="result">
        <h3>结果:</h3>
        <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
      <div v-if="testError" class="error">{{ testError }}</div>
    </div>
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
      error: null,
      testForm: {
        type: 'edu_c_test',
        phone: ''
      },
      testLoading: false,
      testResult: null,
      testError: null
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.error = null;
      this.result = null;
      if (this.form.phone.length !== 11) {
        this.error = '手机号必须为11位数字';
        this.loading = false;
        return;
      }
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
    },
    async testSubmitForm() {
      this.testLoading = true;
      this.testError = null;
      this.testResult = null;
      if (this.testForm.phone.length !== 11) {
        this.testError = '手机号必须为11位数字';
        this.testLoading = false;
        return;
      }
      try {
        const response = await axios.get('http://8.129.86.105:5000/code/login_code', {
          params: {
            phone: this.testForm.phone,
            type: this.testForm.type
          }
        });
        this.testResult = response.data;
      } catch (err) {
        this.testError = err.response ? err.response.data : err.message;
      } finally {
        this.testLoading = false;
      }
    }
  }
};
</script>
<style scoped>
.admin-verify {
  padding: 16px;
}
.admin-verify-test {
  padding: 16px;
  margin-top: 32px;
  border-top: 1px solid #ccc;
}
.form-group {
  margin-bottom: 12px;
}
label {
  display: block;
  margin-bottom: 4px;
}
select, input {
  width: 20ch;
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