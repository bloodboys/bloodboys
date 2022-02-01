<template>
    <!-- 面包屑区域 -->
    <div class="">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="onSubmitSearch"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table
                :data="userList.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)"
                border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" active-value="1" inactive-value="0"
                            @change="userStateChanged(scope.row)"></el-switch>

                    </template>

                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 角色分配按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="userList.length">
            </el-pagination>

        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证对象
      addFormRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '用户名长度在3-10字符之间',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '用户名长度在6-15字符之间',
          trigger: 'blur'
        }
        ],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        },
        {
          validator: checkEmail,
          trigger: 'blur'
        }
        ],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          validator: checkMobile,
          trigger: 'blur'
        }
        ]

      },
      // 修改表单的验证对象
      editFormRules: {
        email: [{
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        },
        {
          validator: checkEmail,
          trigger: 'blur'
        }
        ],
        mobile: [{
          required: true,
          message: '请输入用户手机号',
          trigger: 'blur'
        },
        {
          validator: checkMobile,
          trigger: 'blur'
        }
        ]

      },
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false

    }
  },
  created () {
    this.getUserList()
  },
  mounted () {
    this.onSubmitSearch()
  },
  methods: {
    // 用户列表获取
    getUserList () {
      this.$api.users().then((res) => {
        if (res.data.status === 200) {
          this.userList = res.data.result
          this.value = res.data.result[0].mg_state
        }
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },
    // 监听switch开关状态的改变
    userStateChanged (userinfo) {
      this.$api.updateuserstate({
        id: userinfo.id,
        username: userinfo.username,
        role_name: userinfo.role_name,
        email: userinfo.email,
        mobile: userinfo.mobile,
        mg_state: userinfo.mg_state
      }).then((res) => {
        if (res.data.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败！')
        } else {
          this.$message.success('更新用户状态成功！')
        }
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return Error()
        // 可以发起添加用户的网络请求
        await this.$api.adduser({
          id: this.userList.length + 1,
          rid: this.userList.length + 10001,
          username: this.addForm.username,
          password: this.addForm.password,
          email: this.addForm.email,
          mobile: this.addForm.mobile
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('添加用户失败！')
          } else {
            this.$message.success('添加用户成功！')
            // 隐藏添加用户的对话框
            this.addDialogVisible = false
            this.getUserList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 用户信息查询
    onSubmitSearch () {
      this.$api
        .usersearch({
          search: this.queryInfo.query
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.userList = res.data.result
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 展示编辑用户的对话框
    showEditDialog (id) {
      this.$api.preUpdateUser({
        id: id
      }).then((res) => {
        /* 赋值 */
        if (res.data.status === 200) {
          this.editForm = res.data.result[0]
        } else {
          return this.$message.error('查询用户信息失败!')
        }
      }).catch((error) => {
        console.log(error)
      })
      this.editDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return Error()
        // 可以发起修改用户的网络请求
        this.$api.updateUser({
          id: this.editForm.id,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('修改用户失败！')
          } else {
            this.$message.success('修改用户成功！')
            // 隐藏修改用户的对话框
            this.editDialogVisible = false
            // 重新刷新数据
            this.getUserList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 根据id删除对于用户信息
    async removeUserById (id) {
      // 弹框询问用户是否删除数据
      await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.deleteUserById({
          id: id
        }).then((res) => {
          if (res.data.status === 200) {
            this.$message.success('用户删除成功!')
            this.getUserList()
          } else {
            this.$message.error('用户删除失败!')
          }
        })
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="less" scoped="">
</style>
