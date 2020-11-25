import axios from './config.js'
// 商品分类数据
export const classification = _ => axios.get('categories')
// 获取动态参数
export const dynamicParameter = (id, params) => axios.get(`categories/${id}/attributes`, { params: params })
// 添加商品信息
export const addGoodsInfo = data => axios.post('goods', data)