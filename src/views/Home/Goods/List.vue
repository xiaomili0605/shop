<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加按钮</el-button>
        </el-col>
      </el-row>
      <el-table border stripe :data="goodsList">
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="300"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsInfo(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
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
  </div>
</template>

<script>
import { getGoods, removeGoods } from '../../../api/goods.js'
export default {
  name: '',
  data() {
    return {
      queryInfo: {
        query: '', // 查询参数 可以为空
        pagenum: 1, // 当前页码值
        pagesize: 5, // 每页显示多少条
      },
      total: 0,
      goodsList: [],
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const res = await getGoods(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    removeGoodsInfo(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeGoods(row.goods_id)
          if (res.meta.status !== 200) return this.$message(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getGoodsList()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 添加：跳转到其他页面进行添加信息渲染
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  mounted() {},
  components: {},
}
</script>

<style scoped lang="scss">
.el-table {
  margin: 10px 0;
}
</style>
