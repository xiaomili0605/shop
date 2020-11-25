import axios from './config.js'

export const getGoods = params => axios.get('goods', { params: params })

// 删除数据
export const removeGoods = id => axios.delete(`goods/${id}`)