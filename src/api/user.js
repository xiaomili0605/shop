import axios from './config.js'
// 获取页面数据
export const getUsers = data => axios.get('users', { params: data })
// 用户状态修改
export const editUserInfo = (uId, type) => axios.put(`users/${uId}/state/${type}`)
// 添加用户信息
export const addUserInfo = data => axios.post('users', data)
// 通过id获取用户信息
export const getUsersInfo = id => axios.get(`users/${id}`)
// 修改用户信息
export const edit = (id, data) => axios.put(`users/${id}`, data)
// 删除用户
export const removeUser = id => axios.delete('users/' + id)
// 获取角色列表
export const getRoles = _ => axios.get('roles')
// 分配角色
export const setRoles = (id, data) => axios.put(`users/${id}/role`, data)

