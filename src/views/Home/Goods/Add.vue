<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <el-steps :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- label-position 设置位置 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" @change="cascaderHandleChange" :props="cascaderProps"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <!-- v-model="item.attr_vals" -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="itemsub" v-for="(itemsub, ind) in item.attr_vals" :key="ind"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传到的API地址  -->
            <!-- list-type 指定不同值 呈现不同渲染效果 -->
            <!-- headers 设置请求头 -->
            <!-- on-preview 点击文件列表中已上传的文件时的钩子 -->
            <!-- on-remove 文件列表移除文件时的钩子 -->
            <!-- on-success 文件上传成功时的钩子 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-success="handleSuccess" :on-remove="handleRemove" :headers="headerObj" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 文本提示信息 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" :options="editorOption"></quill-editor>
            <el-button @click="add" type="primary">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <!-- src 是图片地址 http://xxxxxxx.jpg, 也可以是本地路径 -->
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { classification, dynamicParameter, addGoodsInfo } from '../../../api/add.js'
export default {
  name: '',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 5,
        goods_weight: 0,
        pics: [],
        attrs: [],
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
        goods_price: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
      },
      manyData: [],
      onlyData: [],
      headerObj: {
        Authorization: sessionStorage.getItem('token'),
      },
      uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      previewPath: '',
      previewVisible: false,
      editorOption: {
        placeholder: '编辑文章内容'
      }
    }
  },
  created() {
    this.getClassification()
  },
  methods: {
    async getClassification() {
      const res = await classification()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    cascaderHandleChange() {
      this.addForm.goods_cat.length !== 3 ? (this.addForm.goods_cat = []) : null
    },
    // 切换tab标签时触发
    // 判断：离开的tab的标签 并且 级联选择框的选中值不是3级分类 返回false可以禁止切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClick() {
      // 访问的是动态参数
      if (this.activeIndex == '1') {
        const res = await dynamicParameter(parseInt(this.addForm.goods_cat[2]), { sel: 'many' })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
        })
        this.manyData = res.data
      } else if (this.activeIndex == '2') {
        const res = await dynamicParameter(parseInt(this.addForm.goods_cat[2]), { sel: 'only' })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyData = res.data
      }
    },
    // 图片上传成功的钩子 上传成功后把后端返回图片路径存放到data中(安装接口文档配置请求参数)
    handleSuccess(response) {
      if (response.meta.status !== 200) return this.$message.error(response.data.meta.msg)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 点击文件列表中已上传的文件时的钩子，实现预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 文件列表移除文件时的钩子，file移除参数，同时把请求参数中的path也要删除掉
    handleRemove(file) {
      const path = file.response.data.tmp_path
      const ind = this.addForm.pics.findIndex((item) => item.pic == path)
      this.addForm.pics.splice(ind, 1)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        const addFromObj = _.cloneDeep(this.addForm)
        addFromObj.goods_cat = addFromObj.goods_cat.join(',')
        this.manyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id.join(''),
            attr_value: item.attrs_vals.join('')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        addFromObj.attrs = this.addForm.attrs
        const res = await addGoodsInfo(addFromObj)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  components: {},
}
</script>

<style scoped lang="scss">
.el-alert {
  margin-bottom: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
/**
  最新高度 字体大小
*/
/deep/.ql-toolbar.ql-snow + .ql-container.ql-snow {
  min-height: 300px;
  font-size: 14px;
  margin-bottom: 15px;
}
</style>
