<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card > 
        <el-table :data="rightsList" border>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="权限" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag type="primary" v-if="scope.row.level==0">一级</el-tag>
                    <el-tag type="success" v-if="scope.row.level==1">二级</el-tag>
                    <el-tag type="warning" v-if="scope.row.level==2">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
        return{
            // 权限列表
            rightsList:[],
        }
    },
    created(){
        this.getRightsList()
    },
    methods:{
        async getRightsList(){
           const{data:res} = await this.$http.get('rights/list')
           if(res.meta.status!=200){
               return this.$message.console.error('获取权限列表失败');
           }
           this.rightsList = res.data
           console.log(this.rightsList);
        }
    }
};
</script>
<style lang="less" scoped>
</style>