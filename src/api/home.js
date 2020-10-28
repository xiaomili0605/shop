import axios from './config.js'

export const getMenus = _ => axios.get('menus')