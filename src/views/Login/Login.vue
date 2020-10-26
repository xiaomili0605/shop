<template>
  <div class="login_box">
    <div class="login_form">
      <div class="img_box">
        <img :src="imgUrl" alt="" />
      </div>
      <el-form>
        <el-form-item>
          <el-input prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="el-icon-s-goods"></el-input>
        </el-form-item>
        <el-form-item class="btn">
            <el-button type="primary">登录</el-button>
            <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      imgUrl: require('../../assets/logo.png')
    };
  },
  components: {},
};
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
  width: 500px;
  height: 280px;
  background: #ffffff;
  border-radius: 5px;
  padding: 80px 20px 0;
  box-sizing: border-box;
}
.el-form-item {
    margin-bottom: 15px;
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
       background: #EFF1EE;
   }
}
</style>
