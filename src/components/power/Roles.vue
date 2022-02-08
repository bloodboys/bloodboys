<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in JSON.parse(scope.row.children)" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                               <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>

                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)">编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除
                        </el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
                    <el-form
                            :model="addRoleForm"
                            ref="addRoleFormRef"
                            :rules="addRoleFormRules"
                            label-width="100px">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="addRoleForm.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="roleDesc">
                            <el-input v-model="addRoleForm.roleDesc"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
              </span>
                </el-dialog>
                 <!-- 编辑角色对话框 -->
                        <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
                            <el-form
                                    :model="editRoleForm"
                                    ref="editRoleFormRef"
                                    :rules="editRoleFormRules"
                                    label-width="100px">
                                <el-form-item label="角色名称" prop="roleName">
                                    <el-input v-model="editRoleForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item label="角色描述" prop="roleDesc">
                                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="editRoles">确 定</el-button>
                            </span>
                        </el-dialog>
        <!-- 分配权限的对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="SetRightDialogVisible"
          width="50%" @close="SetRightDialogClosed">
          <!-- 树形控件 -->
          <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allRights">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 添加角色对话框
      AddRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {},
      // 添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑角色信息
      editRoleForm: {},
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      SetRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    getRolesList () {
      this.$api.roles().then((res) => {
        if (res.data.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolelist = res.data.result
      })
    },
    // 添加角色对话框的关闭
    addRoleDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRoles () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return Error()
        // 可以发起添加角色的网络请求
        await this.$api.addrole({
          rolename: this.addRoleForm.roleName,
          roledesc: this.addRoleForm.roleDesc
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('添加角色失败！')
          } else {
            this.$message.success('添加角色成功！')
            // 隐藏添加角色的对话框
            this.AddRoleDialogVisible = false
            this.getRolesList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 展示编辑角色的对话框
    async showEditDialog (id) {
      this.$api.preUpdateUserRole({
        id: id
      }).then((res) => {
        /* 赋值 */
        if (res.data.status === 200) {
          this.editRoleForm = res.data.result[0]
        } else {
          return this.$message.error('查询用户角色失败!')
        }
      }).catch((error) => {
        console.log(error)
      })
      this.editRoleDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    editRoleDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoles () {
      this.$refs.editRoleFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return Error()
        // 可以发起编辑角色的网络请求
        this.$api.updateUserRole(
          {
            id: this.editRoleForm.id,
            rolename: this.editRoleForm.roleName,
            roledesc: this.editRoleForm.roleDesc
          }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('修改角色信息失败！')
          } else {
            this.$message.success('修改角色信息成功！')
            // 隐藏编辑角色的对话框
            this.editRoleDialogVisible = false
            // 重新刷新数据
            this.getRolesList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 删除角色
    async removeRoleById (id) {
      await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.deleteRoleById({
          id: id
        }).then((res) => {
          if (res.data.status === 200) {
            this.$message.success('角色删除成功!')
            this.getRolesList()
          } else {
            this.$message.error('角色删除失败!')
          }
        })
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    },
    // 根据id删除对应角色权限
    async removeRightById (role, rightId) {
      // 弹框询问角色是否删除权限
      await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        // 处理角色权限
        const t = JSON.parse(role.children)
        if ((rightId + '').length === 3) {
          const x = t.filter(ite => ite.id !== rightId)
          // 删除接口
          this.$api.deleteRightById({
            id: role.id,
            roles: JSON.stringify(x)
          }).then((res) => {
            if (res.data.status === 200) {
              this.$message.success('权限删除成功!')
              this.$api.returnRightById({
                id: role.id
              }).then((res) => {
                if (res.data.status !== 200) {
                  return this.$message.error('返回角色权限失败')
                }
                role.children = res.data.result[0].children
              })
            } else {
              this.$message.error('权限删除失败!')
            }
          })
        } else if ((rightId + '').length === 4) {
          t.map(item => { const list = item.children.filter(ite => ite.id !== rightId); item.children = list })
          // 删除接口
          this.$api.deleteRightById({
            id: role.id,
            roles: JSON.stringify(t)
          }).then((res) => {
            if (res.data.status === 200) {
              this.$message.success('权限删除成功!')
              this.$api.returnRightById({
                id: role.id
              }).then((res) => {
                if (res.data.status !== 200) {
                  return this.$message.error('返回角色权限失败')
                }
                role.children = res.data.result[0].children
              })
            } else {
              this.$message.error('权限删除失败!')
            }
          })
        } else {
          t.map(item => { item.children.map(ite => { const list = ite.children.filter(it => it.id !== rightId); ite.children = list }) })
          // 删除接口
          this.$api.deleteRightById({
            id: role.id,
            roles: JSON.stringify(t)
          }).then((res) => {
            if (res.data.status === 200) {
              this.$message.success('权限删除成功!')
              this.$api.returnRightById({
                id: role.id
              }).then((res) => {
                if (res.data.status !== 200) {
                  return this.$message.error('返回角色权限失败')
                }
                role.children = res.data.result[0].children
              })
            } else {
              this.$message.error('权限删除失败!')
            }
          })
        }
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    },
    // 展示分配权限的对话框
    showSetRightDialog (role) {
      this.roleId = role.id
      // console.log(this.roleId)
      // 获取所有权限的数据
      this.$api.allRightById().then((res) => {
        if (res.data.status !== 200) {
          return this.$message.error('获取所有权限失败')
        }
        // 把获取到的权限数据保存到data中
        this.rightslist = JSON.parse(res.data.result[0].children)
      })

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.SetRightDialogVisible = true
    },
    // 通过递归的形式,获取角色下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      eval(node.children).forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    SetRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    allRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 更新权限数据
      var x = this.rightslist
      // 第一权限筛选
      for (let i = 0; i < this.rightslist.length; i++) {
        if (keys.indexOf(this.rightslist[i].id) === -1) {
          x = x.filter(ite => ite.id !== this.rightslist[i].id)
        }
      }
      console.log(this.roleId)
      // 第二权限筛选
      for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x[i].children.length; j++) {
          if (keys.indexOf(x[i].children[j].id) === -1) {
            x.map(item => { const list = item.children.filter(ite => ite.id !== x[i].children[j].id); item.children = list })
          }
        }
      }

      // 第三权限筛选
      var c = []
      for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x[i].children.length; j++) {
          for (let k = 0; k < x[i].children[j].children.length; k++) {
            if (keys.indexOf(x[i].children[j].children[k].id) === -1) {
              c.push(x[i].children[j].children[k].id)
            }
          }
        }
      }
      for (let i = 0; i < c.length; i++) {
        x.map(item => { item.children.map(ite => { const list = ite.children.filter(it => it.id !== c[i]); ite.children = list }) })
      }
      console.log(x)
      // 分配权限接口
      this.$api.deleteRightById({
        id: this.roleId,
        roles: JSON.stringify(x)
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message.success('权限分配成功!')
        } else {
          this.$message.error('权限分配失败!')
        }
      })
      this.getRolesList()
      this.SetRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}

.bdtop{
    border-top: 1px solid #eee;
}

.bdbottom{
    border-bottom: 1px solid #eee;
}

.vcenter{
    display: flex;
    align-items: center;
}
</style>
