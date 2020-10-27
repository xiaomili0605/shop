import axios from './config.js'

export const signIn = data => axios.post('login', data)
