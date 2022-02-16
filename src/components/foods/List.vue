<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getFoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="onSubmitSearch"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加菜品</el-button>
                </el-col>
            </el-row>
            <!-- table 表格区域-->
            <el-table :data="foodslist.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="菜品名称" prop="foods_name"></el-table-column>
                <el-table-column label="菜品价格(元)" prop="foods_price" width="95px"></el-table-column>
                <el-table-column label="菜品重量" prop="foods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditListDialog(scope.row.foods_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeById(scope.row.foods_id)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页区-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="foodslist.length" background>
            </el-pagination>
        </el-card>
        <!-- 编辑菜品的对话框 -->
                <el-dialog title="编辑菜品" :visible.sync="editListDialogVisible" width="50%" @close="editListDialogClosed">
                    <el-form
                            :model="editListForm"
                            :rules="editListFormRules"
                            ref="editListFormRef"
                            label-width="100px"
                    >
                   <el-form-item label="菜品分类" prop="foods_cat">
                        <el-cascader
                                v-model="editListForm.foods_cat"
                                :options="cateList"
                                :props="{expandTrigger: 'hover',...cateProps,checkStrictly: true }"
                                @change="handleChange"
                                clearable
                                >
                        </el-cascader>
                    </el-form-item>
                        <el-form-item label="菜品名称：" prop="foods_name">
                            <el-input v-model="editListForm.foods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品数量：" prop="foods_number">
                            <el-input v-model="editListForm.foods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品价格：" prop="foods_price">
                            <el-input v-model="editListForm.foods_price"></el-input>
                        </el-form-item>
                       <el-form-item label="菜品参数：">
                          <!-- 渲染表单的Item项 -->
                          <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
                              <!-- 复选框组 -->
                              <el-checkbox-group v-model="item.attr_vals">
                                  <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                              </el-checkbox-group>
                          </el-form-item>
                          </el-form-item>
                          <el-form-item label="菜品属性：">

                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals[0]"></el-input>
                        </el-form-item>
                        </el-form-item>
                        <el-form-item label="菜品图片：">
                            <!-- action 图片要上传的服务器地址
                            list-type ：图片组件效果
                            -->
                            <el-upload
                                    :action="uploadURL"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="菜品描述：" prop="foods_introduce">
                            <!-- 富文本编辑器组件 -->
                            <quill-editor v-model="editListForm.foods_introduce">
                            </quill-editor>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                <el-button @click="editListDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editList">确 定</el-button>
              </span>
                </el-dialog>
                <!-- 图片预览 -->
                <el-dialog
                        title="图片预览"
                        :visible.sync="previewVisible"
                        width="50%"
                >
                    <img :src="previewPath" alt="" class="previewImg">

                </el-dialog>
    </div>
</template>

<script>
/* 导入 lodash */
import _ from 'lodash'
export default {
  data () {
    return {
      /* 查询参数对象 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 菜品列表
      foodslist: [],
      // 总数据条数
      total: 0,
      // 控制编辑菜品对话框的显示与隐藏
      editListDialogVisible: false,
      // 编辑菜品表单的验证规则对象
      editListFormRules: {
        foods_name: [
          { required: true, message: '请输入菜品名称', trigger: 'blur' }
        ],
        foods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        foods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        foods_cat: [
          { required: true, message: '请选择菜品分类', trigger: 'blur' }
        ]
      },
      // 编辑表单 绑定对象
      editListForm: {},
      // 上传图片的URL地址
      uploadURL: 'http://localhost:3000/api/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: localStorage.getItem('csn')
      },
      previewPath: '',
      previewVisible: false,
      // 菜品分类列表
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数组
      manyTableData: [],
      // 静态属性数组
      onlyTableData: []
    }
  },
  created () {
    this.getFoodsList()
  },
  methods: {
    // 根据分页获取对应的菜品列表
    async getFoodsList () {
      this.$api.foods().then((res) => {
        if (res.data.status === 200) {
          this.foodslist = res.data.result
        }
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getFoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFoodsList()
    },
    // 菜品信息查询
    onSubmitSearch () {
      this.$api
        .foodsearch({
          search: this.queryInfo.query
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.queryInfo.pagenum = 1
            this.foodslist = res.data.result
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async removeById (id) {
      // 弹框询问用户是否删除数据
      await this.$confirm('此操作将永久删除该菜品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.deleteFoodById({
          foods_id: id
        }).then((res) => {
          if (res.data.status === 200) {
            this.$message.success('菜品删除成功!')
            this.getFoodsList()
            this.queryInfo.pagenum = 1
          } else {
            this.$message.error('菜品删除失败!')
          }
        })
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    },
    goAddpage () {
      this.$router.push('/foodlist/add')
    },
    // 显示编辑对话框
    async showEditListDialog (food) {
      await this.$api.preUpdatefood({ foods_id: food }).then((res) => {
        /* 赋值 */
        if (res.data.status === 200) {
          this.editListForm = { foods_id: res.data.result[0].foods_id, foods_cat: res.data.result[0].cat_id.split(',').map(Number), foods_name: res.data.result[0].foods_name, foods_number: res.data.result[0].foods_number, foods_price: res.data.result[0].foods_price, attrs: res.data.result[0].attrs, pics: [], foods_introduce: res.data.result[0].foods_introduce }
          console.log(res.data.result)
        } else {
          return this.$message.error('获取菜品失败!')
        }
      }).catch((error) => {
        console.log(error)
      })
      this.getCateList()
      // 根据所选分类的id和当前所选的面板，获取对应的参数和属性
      await this.$api.cateparams().then((res) => {
        if (res.data.status === 200) {
          res.data.result.forEach(item => {
          //   /* 将以空格隔开的字符串转换为数组 */
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          console.log(this.editListForm.foods_cat)
          res.data.result = res.data.result.filter(ite => ite.cat_id === JSON.stringify(this.editListForm.foods_cat))
          var many = res.data.result
          var only = res.data.result
          many = res.data.result.filter(ite => ite.attr_sel === 'many')
          only = res.data.result.filter(ite => ite.attr_sel === 'only')
          this.manyTableData = many
          this.onlyTableData = only
        }
      }).catch(error => {
        console.log(error)
      })
      this.editListDialogVisible = true
    },
    // 监听修改菜品对话框的关闭事件
    editListDialogClosed () {
      this.$refs.editListFormRef.resetFields()
    },
    // 编辑菜品名
    editList () {
      this.$refs.editListFormRef.validate(async valid => {
        if (!valid) return Error()
        // 执行添加业务逻辑
        // lodash cloneDeep(obj)

        this.editListForm.attrs = []

        const form = _.cloneDeep(this.editListForm)
        form.foods_cat = form.foods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.editListForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.editListForm.attrs.push(newInfo)
        })
        form.attrs = this.editListForm.attrs
        // 发起请求编辑菜品
        await this.$api.updatefood({
          foods_id: form.foods_id,
          foods_name: form.foods_name,
          foods_price: form.foods_price,
          foods_number: form.foods_number,
          cat_id: form.foods_cat,
          attrs: JSON.stringify(form.attrs),
          pics: JSON.stringify(form.pics),
          foods_introduce: form.foods_introduce
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('修改菜品失败！')
          } else {
            this.$message.success('修改菜品成功！')
            // 隐藏修改菜品的对话框
            this.editListDialogVisible = false
            // 重新刷新数据
            this.getFoodsList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 处理图片的预览效果
    handlePreview (file) {
      this.previewPath = file.response.url.replace('upload', 'http://localhost:3000')
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1 获取要删除的图片的临时路径
      const filePath = file.response.url
      // 2 从 pics 数组中，找到这个图片对应的索引值
      const i =
                    this.editListForm.pics.findIndex(x =>
                      x.pic === filePath)
      // 3 调用数组的 Splice 方法，把图片信息对象，从 pics 数组中移除
      this.editListForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // 1 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.url
      }
      // 2 将图片信息对象 保存到 pics
      this.editListForm.pics.push(picInfo)
    },
    // 获取所有菜品分类数据
    async getCateList () {
      // 把数据列表赋值给catelist
      this.$api.foodscate().then((res) => {
        if (res.data.status === 200) {
          this.cateList = JSON.parse(res.data.result[0].children)
        }
      })
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange () {
      if (this.editListForm.foods_cat.length !== 3) {
        this.editListForm.foods_cat = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .previewImg {
        width: 100%;
    }
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }
</style>
