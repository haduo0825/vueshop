<template>
    <div class="home_container">
        <el-button type="info" @click="logout">退出</el-button>
    </div>    
</template>
<script>
export default {
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="less" scoped>
.home_container{
    height: 100%;
    background-color: green;
}
</style>