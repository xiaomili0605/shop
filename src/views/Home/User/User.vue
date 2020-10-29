<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="showUserDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column prop="mobile" label="电话" width="120px"> </el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#54AAFF" inactive-color="#ff4949" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户 dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogColsed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 dialog -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogColsed">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 dialog -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="roleDialogColsed">
      <el-form>
        <div>
          <p>当前的用户：{{ userInfo.username }}</p>
          <p>当前的角色：{{ userInfo.role_name }}</p>
          <p>
            分配角色：
            <el-select v-model="rolesSelectId" placeholder="请选择">
              <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
            </el-select>
          </p>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateEmail, validateMobile } from '../../../plugins/validate.js'
import { getUsers, editUserInfo, addUserInfo, getUsersInfo, edit, removeUser, getRoles, setRoles } from '../../../api/user.js'
export default {
  name: '',
  data() {
    // 验证邮箱
    let validEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!validateEmail(value)) {
        callback(new Error('请输入合法邮箱'))
      } else {
        callback()
      }
    }
    // 验证手机号
    let validMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!validateMobile(value)) {
        callback(new Error('请输入合法手机号'))
      } else {
        callback()
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      userList: [],
      switchValue: false,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
        ],
        email: [{ validator: validEmail, trigger: 'blur', required: true }],
        mobile: [{ validator: validMobile, trigger: 'blur', required: true }],
      },
      editForm: {},
      editFormRules: {
        email: [{ validator: validEmail, trigger: 'blur', required: true }],
        mobile: [{ validator: validMobile, trigger: 'blur', required: true }],
      },
      editDialogVisible: false,
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      rolesSelectId: ''

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await getUsers(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // switch 发生变化
    async userStateChanged(row) {
      const res = await editUserInfo(row.id, row.mg_state)
      if (res.meta.status !== 200) {
        // 失败时 需要把状态重置回来
        row.mg_state = !row.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    showUserDialog() {
      this.addDialogVisible = true
    },
    addDialogColsed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await addUserInfo(this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
      })
    },
    // 修改用户1  通过id获取数据渲染到修改弹框，前端数据是不安全的，从后端从新获取渲染比较安全
    async showEditDialog(row) {
      this.editDialogVisible = true
      const res = await getUsersInfo(row.id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      console.log(this.editForm)
    },
    editDialogColsed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户2
    editInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        let data = {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        }
        const res = await edit(this.editForm.id, data)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.editDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeUser(row.id)
          if (res.meta.status !== 200) return this.$message(res.meta.msg)
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async showSetRoleDialog(row) {
      this.userInfo = row
      const res = await getRoles()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      console.log(this.rolesList)
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.rolesSelectId) return this.$message.error('请选择要分配的角色')
      const res = await setRoles(this.userInfo.id, { rid: this.rolesSelectId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    roleDialogColsed() {
      this.rolesSelectId = ''
      this.rolesList = []
    }
  },
  components: {},
}
</script>

<style scoped lang="scss">
.el-table {
  margin: 10px 0;
}
</style>
