import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 把弹框组件挂载到 Vue 原型对象上，每个组件使用时 this.$message 即可
Vue.prototype.$message = Message