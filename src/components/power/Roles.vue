<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table border :data="roleList" stripe>
        <el-table-column type="expand">
          <!-- 表格的下拉行 -->
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              v-for="(item, index) in scope.row.children"
              :class="[index === 0 ? 'btop' : '', 'bbottom', 'vcenter']"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item, index) in item.children"
                  :key="item.id"
                  :class="[index === 0 ? '' : 'btop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item.id)"
                      >{{ item.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="item in item.children"
                      :key="item.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item.id)"
                      >{{ item.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗组件 -->
    <el-dialog title="分配权限" :visible.sync="RightsDialogVisiable" @close="setRightsDialogClosed">
      <el-tree :data="rightsTree" :props="treeProps" show-checkbox node-key="id" :default-expand-all='true' :default-checked-keys="defKeys"></el-tree>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="RightsDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="RightsDialogVisiable = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示
      RightsDialogVisiable: false,
      // 接受权限树
      rightsTree: [],
      // 在tree组件中的对应规则
      treeProps:{
        label:'authName',
        children:'children'
      },
      defKeys:[]
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("角色列表请求失败");
      }
      this.roleList = res.data;
      console.log("角色列表", this.roleList);
    },
    async removeRightById(role, rightId) {
      const result = await this.$confirm("是否要删除？", "Tip", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.error("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      // this.getRoleList();
      console.log(res);
      role.children = res.data;
    },
    async setRights(role){
      
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message.error('获取权限树失败')
      }
      this.$message.success('获取权限树成功')
      console.log(role);


      this.getLeafKey(role,this.defKeys)
      this.rightsTree = res.data
      console.log(this.rightsTree);
      this.RightsDialogVisiable = true
    },
    // 递归获取三级权限id
    getLeafKey(node,arr){
      // 如果node节点不包含children属性，则为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(element => this.getLeafKey(element,arr))
    },
    // 重置defkeys,防止前面用户的添加的权限，影响后面的用户
    setRightsDialogClosed(){
      this.defKeys = []
    }
  },
};
</script>

<style scoped lang="less">
.vcenter {
  display: flex;
  align-items: center;
}
.btop {
  border-top: 1px solid #bfbfbf;
}
.bbottom {
  border-bottom: 1px solid #bfbfbf;
}
.el-tag {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 15px;
}
</style>
