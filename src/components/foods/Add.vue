<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加菜品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图-->
        <el-card>
            <!-- 提示区 -->
            <el-alert
                    title="添加菜品信息"
                    type="info"
                    center
                    show-icon
                    :closable="false"
            >
            </el-alert>
            <!-- 步骤条区-->
            <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="菜品参数"></el-step>
                <el-step title="菜品属性"></el-step>
                <el-step title="菜品图片"></el-step>
                <el-step title="菜品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!-- tab 栏区域-->
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave"
                         @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="菜品名称" prop="foods_name">
                            <el-input v-model="addForm.foods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品价格" prop="foods_price">
                            <el-input v-model="addForm.foods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品重量" prop="foods_weight">
                            <el-input v-model="addForm.foods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品数量" prop="foods_number">
                            <el-input v-model="addForm.foods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品分类" prop="foods_cat">
                            <el-cascader
                                    v-model="addForm.foods_cat"
                                    :options="cateList"
                                    :props="{expandTrigger: 'hover',...cateProps,checkStrictly: true }"
                                    @change="handleChange"
                                    clearable
                                    >
                            </el-cascader>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="菜品参数" name="1">
                        <!-- 渲染表单的Item项 -->
                        <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="菜品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="菜品图片" name="3">
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
                    </el-tab-pane>
                    <el-tab-pane label="菜品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.foods_introduce">
                        </quill-editor>
                        <!-- 添加菜品按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加菜品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

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
      activeIndex: '0',
      // 添加菜品表单数据对象
      addForm: {
        foods_name: '',
        foods_price: 0,
        foods_weight: 0,
        foods_number: 0,
        // 菜品所属的分类数组
        foods_cat: [],
        // 图片数组
        pics: [],
        // 菜品详情描述
        foods_introduce: '',
        // 菜品的动态参数或静态属性
        attrs: []
      },
      // 菜品表单验证规则
      addFormRules: {
        foods_name: [
          { required: true, message: '请输入菜品名称', trigger: 'blur' }
        ],
        foods_price: [
          { required: true, message: '请输入菜品价格', trigger: 'blur' }
        ],
        foods_weight: [
          { required: true, message: '请输入菜品重量', trigger: 'blur' }
        ],
        foods_number: [
          { required: true, message: '请输入菜品数量', trigger: 'blur' }
        ],
        foods_cat: [
          { required: true, message: '请选择菜品分类', trigger: 'blur' }
        ]
      },
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
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://localhost:3000/api/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: localStorage.getItem('csn')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
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
      if (this.addForm.foods_cat.length !== 3) {
        this.addForm.foods_cat = []
      }
    },
    // 切换 tab会触发该函数
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.foods_cat.length !== 3) {
        this.$message.error('请先选择菜品分类')
        return false
      }
    },
    // 点击tab页签触发
    async tabClicked () {
      // 动态参数面板
      if (this.activeIndex === '1') {
        // 根据所选分类的id和当前所选的面板，获取对应的参数
        this.$api.cateparams().then((res) => {
          if (res.data.status === 200) {
            res.data.result.forEach(item => {
            //   /* 将以空格隔开的字符串转换为数组 */
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            })
            res.data.result = res.data.result.filter(ite => ite.cat_id === JSON.stringify(this.addForm.foods_cat))
            res.data.result = res.data.result.filter(ite => ite.attr_sel === 'many')
            this.manyTableData = res.data.result
          }
        }).catch(error => {
          console.log(error)
        })
      } else if (this.activeIndex === '2') {
        // 根据所选分类的id和当前所选的面板，获取对应的静态属性
        this.$api.cateparams().then((res) => {
          if (res.data.status === 200) {
            res.data.result = res.data.result.filter(ite => ite.cat_id === JSON.stringify(this.addForm.foods_cat))
            res.data.result = res.data.result.filter(ite => ite.attr_sel === 'only')
            this.onlyTableData = res.data.result
          }
        }).catch(error => {
          console.log(error)
        })
      }
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
                    this.addForm.pics.findIndex(x =>
                      x.pic === filePath)
      // 3 调用数组的 Splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // 1 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.url
      }
      // 2 将图片信息对象 保存到 pics
      this.addForm.pics.push(picInfo)
    },
    // 添加菜品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        // 添加表单预验证
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加业务逻辑
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.foods_cat = form.foods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        // 发起请求添加菜品
        // 菜品的名称，必须是唯一的
        await this.$api.addfood({
          foods_name: form.foods_name,
          foods_price: form.foods_price,
          foods_number: form.foods_number,
          foods_weight: form.foods_weight,
          cat_id: form.foods_cat,
          attrs: JSON.stringify(form.attrs),
          pics: JSON.stringify(form.pics),
          foods_introduce: form.foods_introduce
        }).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('添加菜品失败！')
          } else {
            this.$message.success('添加菜品成功！')
            this.$router.push('/foodlist')
          }
        }).catch(error => {
          console.log(error)
        })
      })
    }
  },
  computed: {
    // 当前选中的三级分类的Id
    cateId () {
      if (this.addForm.foods_cat.length === 3) {
        return this.addForm.foods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>
