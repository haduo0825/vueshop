import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/login',
            component: Login
        }, 
        {
            path: '/home',
            component: Home
        }, 
        
    ]
});

// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
    //to将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 表示放行
    if(to.path === '/login') return next();
    const token = window.sessionStorage.getItem('token');
    if(!token) return next('/login');
    next();
})
export default router;