<template>
  <div class="login_box">
    <div class="login_form">
      <div class="img_box">
        <img :src="imgUrl" alt="" />
      </div>
      <el-form :model="loginForm" :rules="loginFormRule" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-s-goods" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { signIn } from '../../api/login.js'
export default {
  name: '',
  data() {
    return {
      imgUrl: require('../../assets/logo.png'),
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 点击重置按钮 重置表单
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await signIn(this.loginForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // token 存储本地
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
  },
  components: {},
}
</script>

<style scoped lang="scss">
.login_box {
  background: #335675;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_form {
  position: relative;
  width: 400px;
  height: 280px;
  background: #ffffff;
  border-radius: 5px;
  padding: 80px 20px 0;
  box-sizing: border-box;
}
.el-form-item {
  margin-bottom: 20px;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.img_box {
  width: 80px;
  height: 80px;
  position: absolute;
  left: 50%;
  top: -40px;
  transform: translate(-50%);
  border: 1px solid #eee;
  border-radius: 50%;
  background: #ffffff;
  padding: 5px;
  box-shadow: 0 0 5px #eee;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: block;
    background: #eff1ee;
  }
}
</style>
