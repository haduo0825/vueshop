import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
Vue.config.productionTip = false
// 设置根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config.headers.Authorization);
  return config  
})
// 将vue的原型上绑定axios
Vue.prototype.$http = axios

new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
