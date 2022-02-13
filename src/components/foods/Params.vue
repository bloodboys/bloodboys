<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 警告区-->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 选择菜品分类区域 -->
            <el-row class="cat-opt">
                <el-col>
                    <span>菜品分类：</span>
                    <!-- 选择菜品分类的级联选择框 -->
                    <!-- options :指定数据源-->
                    <!-- props :用来指定配置对象-->
                    <!-- model :选中的父级分类的Id数组-->
                    <!-- change :当选中改变时触发的事件-->
                    <!-- clearable :清空选择-->
                    <el-cascader v-model="selectedCateKeys" :options="cateList"
                        :props="{expandTrigger: 'hover',...cateProps,checkStrictly: true } " @change="handleChange"
                        clearable></el-cascader>
                </el-col>
            </el-row>
            </el-row>
            <!-- tab 页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                                    @close="handleClose(i,scope.row)">{{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    @click="showEditDialog(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" size="mini" @click="removeParams(scope.row.attr_id)"
                                    icon="el-icon-delete">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                                    @close="handleClose(i,scope.row)">{{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                    @click="showEditDialog(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" size="mini" @click="removeParams(scope.row.attr_id)"
                                    icon="el-icon-delete">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框 -->
                <el-dialog
                        :title="'添加'+titleText"
                        :visible.sync="addDialogVisible"
                        width="50%"
                        @close="addDialogClosed"
                >
                    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                        <el-form-item :label="titleText" prop="attr_name">
                            <el-input v-model="addForm.attr_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addParams">确 定</el-button>
                    </span>
                </el-dialog>

                 <!-- 修改参数对话框-->
                        <el-dialog
                                :title="'修改'+titleText"
                                :visible.sync="editDialogVisible"
                                width="50%"
                                @close="editDialogClosed"
                        >
                            <!-- 修改参数对话框 -->
                            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                                <el-form-item :label="titleText" prop="attr_name">
                                    <el-input v-model="editForm.attr_name"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="editDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="editParams">确 定</el-button>
                            </span>
                        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 菜品分类列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 控制添加对话框的显示和隐藏
      addDialogVisible: false,
      // 添加参数表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示和隐藏
      editDialogVisible: false,
      // 修改参数表单数据对象
      editForm: {
        attr_name: '',
        attr_id: ''
      },
      // 修改表单验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有菜品分类列表
    async getCateList () {
      // 把数据列表赋值给cateList
      this.$api.foodscate().then((res) => {
        if (res.data.status === 200) {
          this.cateList = JSON.parse(res.data.result[0].children)
        }
      })
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange () {
      this.getParamsList()
    },
    // tab 页签点击事件的处理函数
    handleTabClick () {
      this.getParamsList()
    },
    // 获取参数的列表数据
    getParamsList () {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(JSON.stringify(this.selectedCateKeys))
      // 证明选中的是三级分类
      // 根据所选分类的id和当前所选的面板，获取对应的参数
      this.$api.cateparams().then((res) => {
        if (res.data.status === 200) {
          res.data.result.forEach(item => {
            /* 将以空格隔开的字符串转换为数组 */
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            /* 控制文本框的显示和隐藏 */
            item.inputVisible = false
            /* 文本框中输入的值 */
            item.inputValue = ''
          })
          res.data.result = res.data.result.filter(ite => ite.cat_id === JSON.stringify(this.selectedCateKeys))
          if (this.activeName === 'many') {
            res.data.result = res.data.result.filter(ite => ite.attr_sel === 'many')
            this.manyTableData = res.data.result
          } else {
            res.data.result = res.data.result.filter(ite => ite.attr_sel === 'only')
            this.onlyTableData = res.data.result
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 对话框的关闭事件监听
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.activeName)
        // 可以发起添加参数的网络请求
        await this.$api.addcateparams({
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
          cat_id: JSON.stringify(this.selectedCateKeys)
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('添加菜品参数失败！')
          } else {
            this.$message.success('添加菜品参数成功！')
          }
          this.getParamsList()
          // 隐藏添加参数的对话框
          this.addDialogVisible = false
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 点击按钮，展示修改对话框
    async showEditDialog (attrId) {
      // 查询当前参数的信息
      this.$api.preUpdateParams({
        attr_id: attrId,
        cat_id: JSON.stringify(this.selectedCateKeys)
      }).then((res) => {
        /* 赋值 */
        if (res.data.status === 200) {
          this.editForm = res.data.result[0]
        } else {
          return this.$message.error('获取参数信息失败!')
        }
      }).catch((error) => {
        console.log(error)
      })
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起编辑分类参数的网络请求
        this.$api.updateParams({
          attr_id: this.editForm.attr_id,
          cat_id: JSON.stringify(this.selectedCateKeys),
          attr_name: this.editForm.attr_name,
          attr_vals: this.editForm.attr_vals
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('修改菜品参数失败！')
          } else {
            this.$message.success('修改菜品参数成功！')
            // 隐藏修改参数的对话框
            this.editDialogVisible = false
            // 重新刷新数据
            this.getParamsList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 点击按钮，删除参数
    async removeParams (attrId) {
      await this.$confirm('此操作将永久删除该菜品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.deleteParamsById({
          attr_id: attrId
        }).then((res) => {
          if (res.data.status === 200) {
            this.$message.success('菜品参数删除成功!')
            this.getParamsList()
          } else {
            this.$message.error('菜品参数删除失败!')
          }
        })
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    },
    // 文本框失去焦点，或摁下了 Enter 都会触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续的处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 点击按钮，展示输入文本框
    showInput (row) {
      row.inputVisible = true
      /* 让文本框自动获得焦点 */
      /* $nextTick：页面中的元素被重新渲染后，才会回调函数中的代码 */
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 将对save_vals的操作，保存到数据库
    async saveAttrVals (row) {
      console.log(row.attr_vals.join(','))
      // 需要发起请求，保存到数据库中
      this.$api.updateParams({
        attr_id: row.attr_id,
        cat_id: JSON.stringify(this.selectedCateKeys),
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(',')
      }).then((res) => {
        if (res.data.status !== 200) {
          return this.$message.error('修改参数项失败！')
        } else {
          this.$message.success('修改参数项成功！')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除对应的参数可选项目
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }

  },

  computed: {
    // 如果按钮需要被禁用,则返回true,否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .cat-opt {
        margin: 15px 0;
    }
    .el-tag{
        margin: 10px;
    }
    .input-new-tag {
            width: 120px;
        }
</style>
