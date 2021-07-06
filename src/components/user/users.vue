<template>
  <div class="users_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            :span="6"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :span="2" @click="callDialog"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="userList" style="width: 100%" border="">
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChanged(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row align="center" type="flex">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="isVisible"
      @close="addDialogClose"
    >
      <el-form
        :model="addUserInfo"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑用户"
      :visible.sync="isEditVisiable"
      @close="isEditVisiable = false"
    >
      <el-form :model="editInfo" ref="editRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editCommit"
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
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      isVisible: false,
      addUserInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "用户名需要控制在3-5位", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "密码需要控制在6-12位", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
      editInfo: {},
      isEditVisiable: false,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      console.log('now in page',this.queryInfo.pagenum);
    },
    currentPage4() {},
    // 监听switch开关状态的改变
    async userStateChanged(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status != 200) {
        this.queryInfo.mg_state = !this.queryInfo.mg_state;
        this.$message.error("更新状态失败");
      }
      this.$message.success("更新状态成功");
    },
    callDialog() {
      this.isVisible = true;
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    validateForm() {
      this.isVisible = false;
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // console.log(valid);
        const { data: res } = await this.$http.post(`users`, this.addUserInfo);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.getUserList();
      });
    },
    async handleEdit(id) {
      console.log(id);
      this.isEditVisiable = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("查询用户失败");
      }
      this.editInfo = res.data;
    },
    async editCommit(){
      const {data:res} = await this.$http.put('users/'+this.editInfo.id,{
        email:this.editInfo.email,
        mobile:this.editInfo.mobile
      })
      if(res.meta.status!=200){
        return this.$message.error('提交失败')
      }
      console.log(res.data);
      this.isEditVisiable = false
      this.getUserList()
    },
    async removeUserById(id){
      console.log('需要删除的用户的id：',id);
      const result =await this.$confirm('是否要删除？','Tip',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err => err)
      const {data:res} = await this.$http.delete('users/'+id)
      if(res.meta.status!=200){
        console.log(111,res);
        return this.$message.error('删除失败')
        
      }
      this.$message.success('删除成功')
      this.getUserList()
    }
  },
};
</script>
<style lang="less" scoped>
.users_container {
  height: 100%;
}
.box-card {
  margin-top: 15px;
}
</style>>

