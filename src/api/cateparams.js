import axios from './config.js'
// 获取商品分类数据列表
export const getCate = _ => axios.get('categories')
// 获取动态参数/静态属性
export const getParams = (id, data) => axios.get(`categories/${id}/attributes`, { params: data })
// 添加动态参数或静态属性
export const addCate = (id, data) => axios.post(`categories/${id}/attributes`, data)
// 根据id获取参数
export const getCatePories = (id, attrId, data) => axios.get(`categories/${id}/attributes/${attrId}`, { params: data })
// 修改
export const editCate = (id, attrId, data) => axios.put(`categories/${id}/attributes/${attrId}`, data)
// 删除参数
export const deleteCate = (id, attrId) => axios.delete(`categories/${id}/attributes/${attrId}`)
// 添加参数
export const addCateParams = (id, attrId, data) => axios.put(`categories/${id}/attributes/${attrId}`, data)