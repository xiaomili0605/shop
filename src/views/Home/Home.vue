<template>
  <el-container class="home_box">
    <el-header>
      <div class="img_box">
        <img :src="imgUrl" alt="" />
      </div>
      <el-button @click="logout" type="info">退出</el-button></el-header
    >
    <el-container class="main_box">
      <el-aside :width=" isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="cutCollapse">|||</div>
        <el-menu class="el-menu-vertical-demo"  background-color="#393F4C" text-color="#fff" active-text-color="#226AC1" unique-opened  :collapse-transition="false" :collapse="isCollapse" :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]" style="margin-right: 10px;"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id" @click="goPage(subItem)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from '../../api/home.js'
export default {
  name: '',
  data() {
    return {
      imgUrl: require('../../assets/logo.png'),
      menuList: [],
      iconObj: {
        '125': 'iconfont iconuser',
        '103': 'iconfont iconlifangti2',
        '101': 'iconfont iconshangpinguanli',
        '102': 'iconfont icondingdanguanli',
        '145': 'iconfont iconshujutongji'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenusList() {
      const res = await getMenus()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    goPage(item) {
      const path = '/' + item.path
      this.$router.push(path)
      // 保存激活状态： 点击时保存到sessionStorage中，在emnu中设置
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    cutCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {},
}
</script>

<style scoped lang="scss">
.home_box {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #3f4648;
  .img_box {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background: #373d48;
}
.el-main {
  background: #ecf0f2;
}
.el-menu {
  border-right: none;
}
.collapse {
  color: #fff;
  font-size: 18px;
  text-align: center;
  letter-spacing: 2px;
  background: #525C6E;
}
</style>
