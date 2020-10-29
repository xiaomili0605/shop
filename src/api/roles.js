import axios from './config.js'
// 获取角色列表
export const getRoles = _ => axios.get('roles')
// 删除权限
export const deleteRoles = (roleId, rightId) => axios.delete('roles/' + roleId + '/rights/' + rightId)
// 获取所有权限列表
export const getRights = _ => axios.get('rights/tree')
// 修改权限
export const editRoles = (roleId, data) => axios.post(`roles/${roleId}/rights`, data)