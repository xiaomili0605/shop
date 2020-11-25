import Vue from 'vue'

// 全局过滤器 日期
Vue.filter('dataFormat', function(val){
    const dt = new Date(val)
    const y = dt.getFullYear() // 年
    const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
    const d = (dt.getDate() + '').padStart('2', '0') // 日

    const hh = (dt.getHours() + '').padStart('2', '0') // 时
    const mm = (dt.getMinutes() + '').padStart('2', '0') // 分
    const ss = (dt.getSeconds() + '').padStart('2', '0') // 秒
    
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})