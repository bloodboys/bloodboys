<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table class="treeTable" :data="catelist.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)" :columns="columns" :selection-type="false"
                :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10 ,15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="catelist.length">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogCloded">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- option用来指定数据源 -->
                    <!-- props用来指定配置对象 -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList"
                        :props="{expandTrigger: 'hover',...cascaderProps,checkStrictly: true } "
                        @change="parentCateChanged" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类的对话框 -->
                <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
                    <el-form
                            :model="editCateForm"
                            :rules="editCateFormRules"
                            ref="editCateFormRef"
                            label-width="100px"
                    >
                        <el-form-item label="分类名称：" prop="cat_name">
                            <el-input v-model="editCateForm.cat_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="eidtCate">确 定</el-button>
              </span>
                </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 菜品分类的数据列表,默认为空
      catelist: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isok'
      },
      {
        label: '排序',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'opt'
      }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级,默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑分类表单的验证规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 编辑表单 绑定对象
      editCateForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取菜品分类数据
    getCateList () {
      // 把数据列表赋值给catelist
      this.$api.foodscate().then((res) => {
        if (res.data.status === 200) {
          this.catelist = JSON.parse(res.data.result[0].children)
        }
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮,展示添加分类的对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      await this.$api.foodscate().then((res) => {
        if (res.data.status === 200) {
          this.parentCateList = JSON.parse(res.data.result[0].children)
          this.parentCateList.map(item => { item.children.map(ite => { const list = delete ite.children; ite = list }) })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      // 如果 selectedKeys 数组中的length 大于0，证明选择了父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加分类
    async addCate () {
      var adf = this.addCateForm
      var cat = this.catelist
      if (this.selectedKeys.length > 0) {
        // 在已有的一级分类下添加二级分类
        if (this.selectedKeys.length === 1) {
          // 添加二级分类处理逻辑
          if (cat[this.selectedKeys[0] - 1].children === undefined) {
            adf.cat_id = 1
            adf.cat_deleted = false
            adf.cat_ppid = this.selectedKeys
            cat[this.selectedKeys[0] - 1].children = [adf]
          } else {
            adf.cat_id = cat[this.selectedKeys[0] - 1].children.length + 1
            adf.cat_deleted = false
            adf.cat_ppid = this.selectedKeys
            cat[this.selectedKeys[0] - 1].children.push(adf)
          }
        } else {
        // 在已有的二级分类下添加三级分类的处理逻辑
          if (cat[this.selectedKeys[0] - 1].children[this.selectedKeys[1] - 1].children === undefined) {
            adf.cat_id = 1
            adf.cat_deleted = false
            adf.cat_ppid = this.selectedKeys
            cat[this.selectedKeys[0] - 1].children[this.selectedKeys[1] - 1].children = [adf]
          } else {
            adf.cat_id = cat[this.selectedKeys[0] - 1].children[this.selectedKeys[1] - 1].children.length + 1
            adf.cat_deleted = false
            adf.cat_ppid = this.selectedKeys
            cat[this.selectedKeys[0] - 1].children[this.selectedKeys[1] - 1].children.push(adf)
          }
        }
      } else {
        adf.cat_id = cat.length + 1
        adf.cat_deleted = false
        cat.push(adf)
      }

      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return Error()
        // 可以发起添加分类的网络请求
        await this.$api.addfoodscate({
          children: JSON.stringify(cat)
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('添加菜品分类失败！')
          } else {
            this.$message.success('添加菜品分类成功！')
          }
          this.getCateList()
          // 隐藏添加分类的对话框
          this.addCateDialogVisible = false
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogCloded () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 删除分类
    async removeCate (cate) {
      var catl = this.catelist
      if (cate.cat_level === 0) {
        catl = catl.filter(ite => ite.cat_id !== cate.cat_id)
      } else if (cate.cat_level === 1) {
        catl.map(item => { const list = item.children.filter(ite => ite.cat_name !== cate.cat_name); item.children = list })
      } else {
        catl.map(item => { item.children.map(ite => { const list = ite.children.filter(it => it.cat_name !== cate.cat_name); ite.children = list }) })
      }
      await this.$confirm('此操作将永久删除该菜品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.deleteCateById({
          children: JSON.stringify(catl)
        }).then((res) => {
          if (res.data.status === 200) {
            this.$message.success('菜品分类删除成功!')
            this.getCateList()
          } else {
            this.$message.error('菜品分类删除失败!')
          }
        })
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    },
    // 显示编辑对话框
    async showEditCateDialog (cate) {
      this.$api.preUpdateCate().then((res) => {
        /* 赋值 */
        if (res.data.status === 200) {
          this.editCateForm = { cat_name: cate.cat_name, cat_id: cate.cat_id, cat_ppid: cate.cat_ppid }
        } else {
          return this.$message.error('获取分类失败!')
        }
      }).catch((error) => {
        console.log(error)
      })
      this.editCateDialogVisible = true
    },
    // 监听修改分类对话框的关闭事件
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 编辑分类名
    eidtCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return Error()
        var catl = this.catelist
        if (this.editCateForm.cat_ppid === undefined) { catl[this.editCateForm.cat_id - 1].cat_name = this.editCateForm.cat_name } else if (this.editCateForm.cat_ppid.length === 1) {
          catl[this.editCateForm.cat_ppid[0] - 1].children[this.editCateForm.cat_id - 1].cat_name = this.editCateForm.cat_name
        } else {
          catl[this.editCateForm.cat_ppid[0] - 1].children[this.editCateForm.cat_ppid[1] - 1].children[this.editCateForm.cat_id - 1].cat_name = this.editCateForm.cat_name
        }
        // 可以发起编辑分类的网络请求
        this.$api.updateCate({
          children: JSON.stringify(catl)
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('更新分类名失败！')
          } else {
            this.$message.success('更新分类名成功！')
            // 隐藏修改分类的对话框
            this.editCateDialogVisible = false
            // 重新刷新数据
            this.getCateList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    }

  }
}
</script>

<style lang="less" scoped>
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
