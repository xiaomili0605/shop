<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scopes">
            <el-row v-for="item in scopes.row.children" :key="item.id" class="row">
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="removeRightById(scopes.row, item.id)">{{ item.authName }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="18">
                <el-row v-for="subItem in item.children" :key="subItem.id" class="item">
                  <el-col :span="6"
                    ><el-tag closable type="success" @close="removeRightById(scopes.row, subItem.id)">{{ subItem.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18"
                    ><el-tag closable type="warning" v-for="grandsonItem in subItem.children" :key="grandsonItem.id" @close="removeRightById(scopes.row, grandsonItem.id)">{{
                      grandsonItem.authName
                    }}</el-tag></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" width="50" type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column slot-scope="" label="操作" width="300">
          <template slot-scope="scopes">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showRightDialog(scopes.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="resetRightDialog">
      <el-tree default-expand-all :data="rightsList" show-checkbox node-key="id" :default-checked-keys="defKeys" :props="rightsProps" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, deleteRoles, getRights, editRoles } from '../../../api/roles.js'
export default {
  name: '',
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightsList: [], // 像权限这种，一般是由后台返回数据的
      defKeys: [], // 默认勾选的节点ID值
      rightsProps: {
        // 配置tree
        label: 'authName',
        children: 'children',
      },
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const res = await getRoles()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    removeRightById(row, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteRoles(row.id, rightId)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 把最新响应回来的权限赋值渲染，不会出现页面刷新情况，用户体验好一下
          // 后端不返回数据，只能通过从新获取整个页面来处理
          row.children = res.data
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
    async showRightDialog(row) {
      this.roleId = row.id
      // 显示dialog，获取所有权限列表渲染到dialog中。因为显示所有权限，用户手动勾选，把已有的权限默认为勾选状态
      const res = await getRights()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.setRightDialogVisible = true
      // 获取三级id，把三级id设置为默认勾选
      this.getKeys(this.defKeys, row.children)
    },
    // 递归： 获取三级id
    getKeys(keys, data) {
      data.forEach((item) => {
        item.children ? this.getKeys(keys, item.children) : keys.push(item.id)
      })
    },
    resetRightDialog() {
      this.defKeys = []
    },
    // 通过 tree 方法获取到已勾选和半勾选key
    async allotRights() {
      this.setRightDialogVisible = false
      let keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const res = await editRoles(this.roleId, { rids: keys })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
  },
  components: {},
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 10px;
}
.el-tag {
  margin: 10px;
}
.row {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}
.row:nth-child(1) {
  border-top: 1px solid #eee;
}
.item {
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
}
.item:nth-child(1) {
  border-top: none;
}
</style>
