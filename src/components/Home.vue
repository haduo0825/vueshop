<template>
  <el-container class="home_container">
    <el-header>
      <div class="header_container">
        <img src="../assets/shopLogo.png" class="Home_logo" height="40" />
        <span>哈多商城后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse? '64px': '200px'">
        <!-- 父级菜单 -->
        <div class="taggle-button" @click="handlecollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened=true
          :collapse='iscollapse'
          :collapse-transition=false
          :router=true
          :default-active="activePath"
        >
        <!-- 子菜单 -->
          <el-submenu :index="item.id + '' " v-for="item in menuList" :key="item.id" >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/'+child.path" v-for="child in item.children" :key="child.id" @click="savePath('/'+child.path)">
              <i class="el-icon-menu"></i>
              <span>{{child.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menuList:[],
      icons:{
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-help  ',
        '101': 'el-icon-monitor',
        '102': 'el-icon-tickets',
        '145': 'el-icon-s-marketing'
      },
      iscollapse:false,
      activePath:''
    }
  },
  
  created(){
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')

  },

  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      console.log(res);
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList);
    },
    handlecollapse(){
      this.iscollapse = !this.iscollapse
    },
    savePath(activePath){
      window.sessionStorage.setItem('activePath',activePath);
    }
  },
};
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding-left: 0;
  font-size: 20px;
  > .header_container {
    display: flex;
    align-items: center;
  }
  span {
    padding-left: 10px;
  }
}

.el-aside {
  background-color: #333744;
}
.el-main {
  // background-color: #bfa;
}
.el-menu{
  border-right:none;
}
.taggle-button{
  color: white;
  text-align: center;
  background-color: #4a5064;
  font-size: 10px;
  letter-spacing: 0.2em;
  line-height: 24px;
}
</style>
