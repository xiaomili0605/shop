import axios from './config'
// 获取商品分类数据列表
export const getCate = data => axios.get('categories', { params: data } )
// 添加分类
export const addCate = data => axios.post('categories', data)