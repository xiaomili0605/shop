<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <zk-table :data="cateList" :columns="columns" :expand-type="false" :selection-type="false" :show-index="true" index-text="#" stripe border>
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: #46b8b1" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="operation">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
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

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateClosed">
      <el-form ref="addCateRef" label-width="80px" :model="addCateForm" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader :options="parentCateList" :props="cascaderProps" style="width: 100%" v-model="selectedKeys" @change="cascaderHandleChange" :clearable="true"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCate, addCate } from '../../api/categories.js'
export default {
  name: '',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'level',
        },
        {
          label: '操作',
          minWidth: '200px',
          type: 'template',
          template: 'operation',
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: 'true',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const res = await getCate(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    async showAddCateDialog() {
      const res = await getCate({type: 2})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
      console.log(this.parentCateList)
      this.addCateDialogVisible = true
    },
    cascaderHandleChange() {
      console.log(this.selectedKeys)
      // 如果 seletedKeys 数组中的 length 大于 0 ，证明选中父级分类
      // 反之 就说明就没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID是级联选择框选中数组中的最后一项
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 级别：选中几个就是几级，正好和length相等
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 没选时重置为默认值：父级id等于0，级别重置为0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 关闭 dialog 重置表单
    addCateClosed() {
      this.addCateForm.cat_name = '',
      this.addCateForm.cat_pid = 0,
      this.addCateForm.cat_level = 0,
      this.selectedKeys = []
    },
    addCate() {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const res = await addCate(this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  },
  components: {},
}
</script>

<style scoped lang="scss">
.el-table {
  margin: 10px 0;
}
.zk-table {
  margin: 10px 0;
}
</style>
