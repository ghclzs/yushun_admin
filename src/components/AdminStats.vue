<template>
  <div class="admin-stats">
    <h2>学生列表</h2>
    <button @click="addStudent" class="action-btn add-btn">添加学生</button>
    <table class="student-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>年龄</th>
          <th>性别</th>
          <th>班级</th>
          <th>入学日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.age }}</td>
          <td>{{ student.gender }}</td>
          <td>{{ student.class_name }}</td>
          <td>{{ student.admission_date || '无' }}</td>
          <td>
            <button @click="viewStudent(student)" class="action-btn view-btn">查看</button>
            <button @click="editStudent(student)" class="action-btn edit-btn">编辑</button>
            <button @click="deleteStudent(student)" class="action-btn delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="page <= 1">上一页</button>
      <span>第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="page >= totalPages">下一页</button>
      <input type="number" v-model="targetPage" min="1" :max="totalPages" placeholder="页码">
      <button @click="goToPage">跳转</button>
    </div>
    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ modalType === 'view' ? '查看学生' : modalType === 'edit' ? '编辑学生' : '添加学生' }}</h3>
        <div class="modal-body">
          <!-- 修复：ID行保留p（无嵌套div），其他行替换为div.form-item -->
          <p v-if="modalType === 'view'"><strong>ID:</strong> {{ modalData.id }}</p>
          
          <!-- 姓名行：p → div.form-item -->
          <div class="form-item">
            <strong><span v-if="modalType !== 'view'" class="required">*</span>姓名:</strong>
            <input v-if="modalType !== 'view'" v-model="modalData.name" class="edit-input" :placeholder="modalType !== 'view' ? '必填' : ''" @blur="validateField('name')">
            <span v-else>{{ modalData.name }}</span>
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          </div>

          <!-- 年龄行：p → div.form-item -->
          <div class="form-item">
            <strong><span v-if="modalType !== 'view'" class="required">*</span>年龄:</strong>
            <input v-if="modalType !== 'view'" v-model="modalData.age" type="number" class="edit-input" :placeholder="modalType !== 'view' ? '必填' : ''" @blur="validateField('age')">
            <span v-else>{{ modalData.age }}</span>
            <div v-if="errors.age" class="error-message">{{ errors.age }}</div>
          </div>

          <!-- 性别行：p → div.form-item -->
          <div class="form-item">
            <strong><span v-if="modalType !== 'view'" class="required">*</span>性别:</strong>
            <select v-if="modalType !== 'view'" v-model="modalData.gender" class="edit-input" @change="validateField('gender')">
              <option value="">请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
            <span v-else>{{ modalData.gender }}</span>
            <div v-if="errors.gender" class="error-message">{{ errors.gender }}</div>
          </div>

          <!-- 班级行：p → div.form-item -->
          <div class="form-item">
            <strong><span v-if="modalType !== 'view'" class="required">*</span>班级:</strong>
            <input v-if="modalType !== 'view'" v-model="modalData.class_name" class="edit-input" :placeholder="modalType !== 'view' ? '必填' : ''" @blur="validateField('class_name')">
            <span v-else>{{ modalData.class_name }}</span>
            <div v-if="errors.class_name" class="error-message">{{ errors.class_name }}</div>
          </div>

          <!-- 入学日期行：p → div.form-item（无嵌套div，但统一风格） -->
          <div class="form-item">
            <strong>入学日期:</strong> 
            <input v-if="modalType !== 'view'" v-model="modalData.admission_date" type="date" class="edit-input">
            <span v-else>{{ modalData.admission_date }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">关闭</button>
          <button v-if="modalType === 'add'" @click="createStudent" class="btn btn-primary">添加</button>
          <button v-if="modalType === 'edit'" @click="saveEdit" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AdminStats",
  data() {
    return {
      students: [],
      page: 1,
      totalPages: 1,
      pageSize: 10,
      targetPage: 1,
      showModal: false,
      modalData: {},
      modalType: 'view',
      showToast: false,
      toastMessage: '',
      toastType: '', // 'success' or 'error'
      errors: {}
    };
  },
  created() {
    // 确保 errors 对象是响应式的
    this.$set(this, 'errors', {
      name: '',
      age: '',
      gender: '',
      class_name: ''
    });
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents(page = 1) {
      try {
        const response = await axios.get(`http://8.129.86.105:5000/student/list?page=${page}&size=${this.pageSize}`);
        if (response.data.code === 200) {
          this.students = response.data.data.list;
          this.page = response.data.data.current_page;
          this.totalPages = response.data.data.pages;
        }
      } catch (error) {
        // 处理错误
        this.showToastMessage('获取学生列表失败', 'error');
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.fetchStudents(this.page - 1);
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.fetchStudents(this.page + 1);
      }
    },
    goToPage() {
      const page = parseInt(this.targetPage);
      if (page >= 1 && page <= this.totalPages) {
        this.fetchStudents(page);
      } else {
        this.showToastMessage('页码超出范围', 'error');
      }
    },
    viewStudent(student) {
      this.modalType = 'view';
      // 重置错误信息
      this.$set(this, 'errors', {
        name: '',
        age: '',
        gender: '',
        class_name: ''
      });
      this.fetchStudentDetail(student.id);
    },
    addStudent() {
      this.modalType = 'add';
      // 获取当前日期并格式化为 YYYY-MM-DD
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      this.modalData = {
        name: '',
        age: '',
        gender: '男',
        class_name: '',
        admission_date: formattedDate
      };
      // 重置错误信息
      this.$set(this, 'errors', {
        name: '',
        age: '',
        gender: '',
        class_name: ''
      });
      this.showModal = true;
    },
    editStudent(student) {
      this.modalType = 'edit';
      // 重置错误信息
      this.$set(this, 'errors', {
        name: '',
        age: '',
        gender: '',
        class_name: ''
      });
      this.fetchStudentDetail(student.id);
    },
    async fetchStudentDetail(id) {
      try {
        const response = await axios.get(`http://8.129.86.105:5000/student/get_detail/${id}`);
        if (response.data.code === 200) {
          this.modalData = { ...response.data.data };
          this.showModal = true;
        } else {
          this.showToastMessage('获取详情失败', 'error');
        }
      } catch (error) {
        this.showToastMessage('获取详情失败', 'error');
      }
    },
    closeModal() {
      this.showModal = false;
      this.modalData = {};
      this.modalType = 'view';
      this.$set(this, 'errors', {
        name: '',
        age: '',
        gender: '',
        class_name: ''
      });
    },
    saveEdit() {
      // 清空之前的错误
      this.$set(this.errors, 'name', '');
      this.$set(this.errors, 'age', '');
      this.$set(this.errors, 'gender', '');
      this.$set(this.errors, 'class_name', '');

      // 必填字段校验
      let hasError = false;
      if (!this.modalData.name || this.modalData.name.trim() === '') {
        this.$set(this.errors, 'name', '姓名不能为空');
        hasError = true;
      }
      if (!this.modalData.age || this.modalData.age === '') {
        this.$set(this.errors, 'age', '年龄不能为空');
        hasError = true;
      } else if (parseInt(this.modalData.age) <= 0 || parseInt(this.modalData.age) > 150) {
        this.$set(this.errors, 'age', '年龄必须是大于0且小于150的整数');
        hasError = true;
      }
      if (!this.modalData.gender || this.modalData.gender === '') {
        this.$set(this.errors, 'gender', '性别不能为空');
        hasError = true;
      }
      if (!this.modalData.class_name || this.modalData.class_name.trim() === '') {
        this.$set(this.errors, 'class_name', '班级不能为空');
        hasError = true;
      }

      // 如果有错误，不提交
      if (hasError) {
        return;
      }

      const updateData = {
        stu_id: this.modalData.id,
        name: this.modalData.name,
        age: parseInt(this.modalData.age),
        gender: this.modalData.gender,
        class_name: this.modalData.class_name,
        admission_date: this.modalData.admission_date
      };
      this.updateStudent(updateData);
    },
    async updateStudent(data) {
      try {
        const response = await axios.post('http://8.129.86.105:5000/student/update', data);
        if (response.data.code === 200) {
          this.showToastMessage('更新成功', 'success');
          this.closeModal();
          this.fetchStudents(this.page); // 刷新当前页
        } else {
          this.showToastMessage('更新失败: ' + response.data.msg, 'error');
        }
      } catch (error) {
        this.showToastMessage('更新失败：网络异常', 'error');
      }
    },
    async createStudent() {
      // 清空之前的错误
      this.$set(this.errors, 'name', '');
      this.$set(this.errors, 'age', '');
      this.$set(this.errors, 'gender', '');
      this.$set(this.errors, 'class_name', '');

      // 必填字段校验
      let hasError = false;
      if (!this.modalData.name || this.modalData.name.trim() === '') {
        this.$set(this.errors, 'name', '姓名不能为空');
        hasError = true;
      }
      if (!this.modalData.age || this.modalData.age === '') {
        this.$set(this.errors, 'age', '年龄不能为空');
        hasError = true;
      } else if (parseInt(this.modalData.age) <= 0 || parseInt(this.modalData.age) > 150) {
        this.$set(this.errors, 'age', '年龄必须是大于0且小于150的整数');
        hasError = true;
      }
      if (!this.modalData.gender || this.modalData.gender === '') {
        this.$set(this.errors, 'gender', '性别不能为空');
        hasError = true;
      }
      if (!this.modalData.class_name || this.modalData.class_name.trim() === '') {
        this.$set(this.errors, 'class_name', '班级不能为空');
        hasError = true;
      }

      // 如果有错误，不提交
      if (hasError) {
        return;
      }

      const createData = {
        name: this.modalData.name,
        age: parseInt(this.modalData.age),
        gender: this.modalData.gender,
        class_name: this.modalData.class_name,
        admission_date: this.modalData.admission_date
      };

      try {
        const response = await axios.post('http://8.129.86.105:5000/student/add', createData);
        if (response.data.code === 200) {
          this.showToastMessage('添加成功', 'success');
          this.closeModal();
          this.fetchStudents(this.page); // 刷新当前页
        } else {
          this.showToastMessage('添加失败: ' + response.data.msg, 'error');
        }
      } catch (error) {
        this.showToastMessage('添加失败：网络异常', 'error');
      }
    },
    async deleteStudent(student) {
      if (confirm(`确定删除学生: ${student.name}?`)) {
        try {
          const response = await axios.post('http://8.129.86.105:5000/student/delete', { stu_id: student.id });
          if (response.data.code === 200) {
            this.showToastMessage('删除成功', 'success');
            this.fetchStudents(this.page);
          } else {
            this.showToastMessage('删除失败: ' + response.data.msg, 'error');
          }
        } catch (error) {
          this.showToastMessage('删除失败：网络异常', 'error');
        }
      }
    },
    resetErrors() {
      this.$set(this, 'errors', {
        name: '',
        age: '',
        gender: '',
        class_name: ''
      });
    },
    showToastMessage(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;

      // 3秒后自动隐藏toast（原1秒太短，调整为3秒更友好）
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
    validateField(fieldName) {
      this.$nextTick(() => {
        if (this.modalType === 'view') return; // 只在添加或编辑模式下验证

        switch(fieldName) {
          case 'name':
            if (!this.modalData.name || this.modalData.name.trim() === '') {
              this.$set(this.errors, 'name', '姓名不能为空');
            } else {
              this.$set(this.errors, 'name', '');
            }
            break;
          case 'age':
            if (!this.modalData.age || this.modalData.age === '') {
              this.$set(this.errors, 'age', '年龄不能为空');
            } else if (parseInt(this.modalData.age) <= 0 || parseInt(this.modalData.age) > 150) {
              this.$set(this.errors, 'age', '年龄必须是大于0且小于150的整数');
            } else {
              this.$set(this.errors, 'age', '');
            }
            break;
          case 'gender':
            if (!this.modalData.gender || this.modalData.gender === '') {
              this.$set(this.errors, 'gender', '性别不能为空');
            } else {
              this.$set(this.errors, 'gender', '');
            }
            break;
          case 'class_name':
            if (!this.modalData.class_name || this.modalData.class_name.trim() === '') {
              this.$set(this.errors, 'class_name', '班级不能为空');
            } else {
              this.$set(this.errors, 'class_name', '');
            }
            break;
        }
      });
    },
  }
};
</script>

<style scoped>
.admin-stats {
  padding: 20px;
}
.student-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}
.student-table th, .student-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}
.student-table th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
.student-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.student-table tbody tr:hover {
  background-color: #e3f2fd;
  transition: background-color 0.3s;
}
.action-btn {
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}
.add-btn {
  background-color: #17a2b8;
  color: white;
  margin-bottom: 16px;
}
.add-btn:hover {
  background-color: #138496;
}
.view-btn {
  background-color: #28a745;
  color: white;
}
.view-btn:hover {
  background-color: #218838;
}
.edit-btn {
  background-color: #ffc107;
  color: black;
}
.edit-btn:hover {
  background-color: #e0a800;
}
.delete-btn {
  background-color: #dc3545;
  color: white;
}
.delete-btn:hover {
  background-color: #c82333;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}
.pagination button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
}
.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-2px);
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}
.pagination input {
  padding: 10px;
  width: 70px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}
.pagination span {
  font-size: 16px;
  color: #333;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
/* 新增form-item样式，模拟原p标签的margin */
.modal-body .form-item {
  margin: 10px 0;
}
.edit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
}
.required {
  color: red;
  margin-right: 4px;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
.modal-footer {
  text-align: right;
  margin-top: 20px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-secondary:hover {
  background-color: #545b62;
}

/* Toast 通知样式 */
.toast {
  position: fixed;
  top: 20px; /* 从中间改到顶部，更符合用户习惯 */
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s, fadeOut 0.5s 2.5s linear;
  min-width: 200px;
  text-align: center;
}
.toast.success {
  background-color: #28a745;
}
.toast.error {
  background-color: #dc3545;
}
@keyframes slideIn {
  from {
    transform: translateX(-50%) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>