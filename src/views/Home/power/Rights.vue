<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table border stripe ref="rightsRef" :data="rightsList" highlight-current-row style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column property="authName" label="权限名称"> </el-table-column>
        <el-table-column property="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级"> 
            <template slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="danger" size="mini" v-else>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRights } from '../../../api/rights.js'
export default {
  name: '',
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const res = await getRights()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      console.log(this.rightsList)
    },
  },
  components: {},
}
</script>

<style scoped lang="scss">
</style>
