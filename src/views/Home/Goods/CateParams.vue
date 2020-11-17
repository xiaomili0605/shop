<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon> </el-alert>
      <el-row class="seleted_row">
        <label>选择商品分类：</label>
        <el-cascader v-model="cascaderVal" :options="cateList" :props="cascaderProps" @change="cascaderHandleChange" clearable></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane label="动态参数" name="many" :disabled="btnDisabled">
          <el-row>
            <el-col><el-button type="primary" :disabled="btnDisabled" @click="addCate">添加参数</el-button></el-col>
          </el-row>
          <el-table border stripe :data="manyTabData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item, ind) in scope.row.attr_vals" :key="ind" @close="handleClose(scope.row, ind, item)">{{ item }}</el-tag>
                <!-- 输入文本框：inputVisible 控制输入框和按钮的显示隐藏 -->
                <!-- 思路：在响应数据中添加控制input/button的布尔值和value值，可以避免页面多处使用同一个tag组件时绑定1个data属性出现同时变化BUG -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#"></el-table-column>
            <el-table-column property="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShowDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" :disabled="btnDisabled">
          <el-row>
            <el-col><el-button type="primary" :disabled="btnDisabled" @click="addCate">添加属性</el-button></el-col>
          </el-row>
          <el-table border stripe :data="onlyTabData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item, ind) in scope.row.attr_vals" :key="ind" @close="handleClose(scope.row, ind, item)">{{ item }}</el-tag>
                <!-- 输入文本框：inputVisible 控制输入框和按钮的显示隐藏 -->
                <!-- 思路：在响应数据中添加控制input/button的布尔值和value值，可以避免页面多处使用同一个tag组件时绑定1个data属性出现同时变化BUG -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#"> </el-table-column>
            <el-table-column property="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShowDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/添加属性 共用 dialog -->
    <el-dialog :title="`添加${dialogTitle}`" :visible.sync="addCateDialogVisible" width="50%" @close="addDialogClosed">
      <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 dialog -->
    <el-dialog :title="`修改${dialogTitle}`" :visible.sync="editCateDialogVisible" width="50%" @close="editDialogClosed">
      <el-form label-width="80px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCate, getParams, addCate, getCatePories, editCate, deleteCate, addCateParams } from '../../../api/cateparams.js'
export default {
  name: '',
  data() {
    return {
      activeName: 'many',
      cateList: [],
      cascaderVal: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      btnDisabled: true,
      onlyTabData: [],
      manyTabData: [],
      addCateDialogVisible: false,
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
      },
      editCateDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    dialogTitle() {
      return this.activeName == 'many' ? '动态参数' : '静态属性'
    },
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取级联选择框渲染的数据
    async getCateList() {
      const res = await getCate()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择框发送变化时获取数据
    cascaderHandleChange(val) {
      this.getParamsData(val)
    },
    // tabs 切换时获取数据
    tabHandleClick() {
      this.getParamsData(this.cascaderVal)
    },
    // 获取数据函数
    async getParamsData(val) {
      if (val.length !== 3) {
        this.btnDisabled = true
        this.onlyTabData = []
        this.manyTabData = []
        return (this.cascaderVal = [])
      }
      this.btnDisabled = false
      const id = this.cascaderVal[2]
      const res = await getParams(id, { sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 返回的数据做处理，字符串转数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
        // 给响应数据添加控制input的显示与隐藏
        // 思路：可以避免在 data 中绑定属性时出现共用一个属性值BUG
        item.inputVisible = false
        // 给响应数据添加input输入的值
        item.inputValue = ''
      })
      // 判断响应回来的数据分别赋值
      // 为 only 时赋值数据  否则为 many 赋值
      if (res.data.length && res.data[0].attr_sel == 'only') return (this.onlyTabData = res.data)
      this.manyTabData = res.data
    },
    addCate() {
      this.addCateDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addCateInfo() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const data = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
        const res = await addCate(this.cascaderVal[2], data)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addCateDialogVisible = false
        this.getParamsData(this.cascaderVal)
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 通过id获取该行数据渲染到修改form中
    async editShowDialog(row) {
      this.editCateDialogVisible = true
      const attrId = Number(this.cascaderVal[2])
      const data = { attr_sel: this.activeName }
      const res = await getCatePories(attrId, row.attr_id, data)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    // 修改
    editCateInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const data = {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }
        const res = await editCate(this.cascaderVal[2], this.editForm.attr_id, data)
        this.editCateDialogVisible = false
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData(this.cascaderVal)
      })
    },
    removeCate(row) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteCate(this.cascaderVal[2], row.attr_id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getParamsData(this.cascaderVal)
        })
        .catch(() => {
          this.$message.info('已取消删除！')
        })
    },
    // input 失去焦点 或 enter 键都会触发这个函数
    // 发送添加请求
    async handleInputConfirm(row) {
      // 对输入内容处理一下
      if (row.inputValue.trim().length == 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 往响应回来的数据中push，push完清空input显示button
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 前端页面渲染处理完后，发起请求添加到后端，这样才能实现
      const data = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      const res = await addCateParams(this.cascaderVal[2], row.attr_id, data)
      // 添加请求失败时提示用户，并删除页面已渲染出来的那一项
      if (res.meta.status !== 200) {
        row.attr_vals.pop()
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      // 把输入框设置为true后，页面会显示input，要想获取input的，需要等页面重新渲染(因为vue的dom是异步渲染)。使用$nextTick是元素重新渲染之后才执行回调函数
      row.inputVisible = true
      // 自动获取focus焦点
      // nextTick 方法的作用，当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag和添加tag共用一个接口
    async handleClose(row, ind, item) {
      // 这里只是页面删除了这个tag
      row.attr_vals.splice(ind, 1)
      // 请求参数
      const data = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      const res = await addCateParams(this.cascaderVal[2], row.attr_id, data)
      // 删除失败时，把删除的tag添加进去
      if (res.meta.status !== 200) {
        row.attr_vals.push(item)
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    }
  },
  components: {},
}
</script>

<style scoped lang="scss">
.seleted_row {
  margin: 15px 0;
  display: flex;
  align-items: center;
}
.el-table {
  margin-top: 10px;
}
.el-cascader {
  min-width: 200px;
}
.el-tag {
  margin: 5px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

