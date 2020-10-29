import axios from './config'
// 所有权限列表
export const getRights = _ => axios.get('rights/list')
