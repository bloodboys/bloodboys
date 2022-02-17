const express = require('express')
const router = express.Router()
const sqlClient = require('./config')
const jwt = require('jsonwebtoken')
// const url = require('url')
const fs = require('fs')
const multer = require('multer')

// 登录
router.post('/login', (req, res) => {
  const {
    username,
    password
  } = req.body
  const sql = 'select * from user where username=? and password=?'
  const arr = [username, password]
  sqlClient(sql, arr, result => {
    if (result.length > 0) {
      const token = jwt.sign({
        username,
        id: result[0].id
      }, 'soomekeys')
      res.send({
        status: 200,
        token,
        username
      })
    } else {
      res.send({
        status: 401,
        msg: '登录失败'
      })
    }
  })
})

//  用户信息查询

router.get('/usersearch', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const search = a.searchParams.get('search')
  const sql = "select * from user where concat(`username`,`mobile`,`email`,`mg_state`,`role_name`) like '%" + search + "%'"
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result

      })
    } else {
      res.send({
        status: 500,
        msg: '暂无数据'
      })
    }
  })
})

// 左侧菜单权限
router.get('/menus', (req, res) => {
  const sql = 'select * from menus where id'
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result

      })
    } else {
      res.send({
        status: 401,
        msg: '获取菜单失败'

      })
    }
  })
})

// 用户列表
router.get('/users', (req, res) => {
  const sql = 'select * from user where id '
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 401,
        msg: '获取用户列表失败'
      })
    }
  })
})

// 用户状态修改
router.get('/users/uId/state/type', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const mgstate = a.searchParams.get('mg_state')
  const sql = 'update user set mg_state=? where id=?'
  const arr = [mgstate, id]

  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '修改用户状态成功'

      })
    } else {
      res.send({
        status: 500,
        msg: '修改用户状态失败'
      })
    }
  })
})

// 添加用户
router.get('/adduser', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const rid = a.searchParams.get('rid')
  const username = a.searchParams.get('username')
  const password = a.searchParams.get('password')
  const mobile = a.searchParams.get('mobile')
  const email = a.searchParams.get('email')
  const sql = 'insert into user values (?,?,?,?,?,?,0,"普通用户")'
  const arr = [id, rid, username, password, mobile, email]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '添加用户成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '添加用户失败'
      })
    }
  })
})

// 用户编辑预更新
router.get('/preUpdateUser', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'select * from user where id=?'
  sqlClient(sql, [id], result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '用户预更新失败'
      })
    }
  })
})

// 用户编辑
router.get('/updateUser', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const rid = a.searchParams.get('rid')
  const email = a.searchParams.get('email')
  const mobile = a.searchParams.get('mobile')
  const rolename = a.searchParams.get('rolename')
  const sql = 'update user set rid=?,email=?,mobile=?,role_name=? where id=?'
  const arr = [rid, email, mobile, rolename, id]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '用户修改成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '用户修改失败'
      })
    }
  })
})

// 用户删除
router.get('/deleteUserById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'delete from user where id=?'
  const arr = [id]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '删除用户成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '删除用户失败'
      })
    }
  })
})

// 权限列表
router.get('/rights', (req, res) => {
  const sql = 'select * from rights where id '
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 401,
        msg: '获取权限列表失败'
      })
    }
  })
})

// 角色列表
router.get('/roles', (req, res) => {
  const sql = 'select * from roles where id '
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 401,
        msg: '获取角色列表失败'
      })
    }
  })
})

// 角色权限删除
router.get('/deleteRightById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const role = a.searchParams.get('roles')
  const sql = 'update roles set children=? where id=?'
  const arr = [role, id]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '删除角色权限成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '删除角色权限失败'
      })
    }
  })
})

// 返回角色权限
router.get('/returnRightById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'select * from roles where id=?'
  const arr = [id]
  sqlClient(sql, arr, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: '返回角色权限成功',
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '返回角色权限失败'
      })
    }
  })
})

// 获取所有权限列表
router.get('/allRightById', (req, res) => {
  const sql = 'select * from allrights where id'
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: '获取所有权限列表成功',
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '获取所有权限列表失败'
      })
    }
  })
})

// 用户角色对应id查找
router.get('/UserRoleById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'select roleName from roles where id=?'
  const arr = [id]
  sqlClient(sql, arr, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: '用户角色查找成功',
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '用户角色查找失败'
      })
    }
  })
})

// 添加角色
router.get('/addrole', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const rolename = a.searchParams.get('rolename')
  const roledesc = a.searchParams.get('roledesc')
  const sql = 'insert into roles values (null,?,?,null)'
  const arr = [rolename, roledesc]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '添加用户成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '添加用户失败'
      })
    }
  })
})

// 角色编辑预更新
router.get('/preUpdateUserRole', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'select * from roles where id=?'
  sqlClient(sql, [id], result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '角色预更新失败'
      })
    }
  })
})

// 角色编辑
router.get('/updateUserRole', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const rolename = a.searchParams.get('rolename')
  const roledesc = a.searchParams.get('roledesc')
  const sql = 'update roles set roleName=?,roleDesc=? where id=?'
  const arr = [rolename, roledesc, id]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '角色修改成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '角色修改失败'
      })
    }
  })
})

// 角色删除
router.get('/deleteRoleById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'delete from roles where id=?'
  const arr = [id]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '删除角色成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '删除角色失败'
      })
    }
  })
})

// 菜品分类列表
router.get('/foodscate', (req, res) => {
  const sql = 'select * from foodscate where id '
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 401,
        msg: '获取菜品分类列表失败'
      })
    }
  })
})

// 添加菜品分类
router.get('/addfoodscate', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const children = a.searchParams.get('children')
  const sql = 'update foodscate set children=? where id=?'
  const arr = [children, 1]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '菜品分类添加成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '菜品分类添加失败'
      })
    }
  })
})

// 菜品分类编辑预更新
router.get('/preUpdateCate', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const sql = 'select children from foodscate where id'
  sqlClient(sql, [id], result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '角色预更新失败'
      })
    }
  })
})

// 菜品分类名修改
router.get('/updateCate', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const children = a.searchParams.get('children')
  const sql = 'update foodscate set children=? where id=?'
  const arr = [children, 1]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '菜品分类名修改成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '菜品分类名修改失败'
      })
    }
  })
})

// 菜品分类删除
router.get('/deleteCateById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const children = a.searchParams.get('children')
  const sql = 'update foodscate set children=? where id=?'
  const arr = [children, 1]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '菜品分类删除成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '菜品分类删除失败'
      })
    }
  })
})

// 获取参数列表
router.get('/cateparams', (req, res) => {
  const sql = 'select * from cateparams where attr_id'
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: '获取所有参数列表成功',
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '获取所有参数列表失败'
      })
    }
  })
})

// 添加分类参数
router.get('/addcateparams', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const catid = a.searchParams.get('cat_id')
  const attrname = a.searchParams.get('attr_name')
  const attrsel = a.searchParams.get('attr_sel')
  const sql = 'insert into cateparams values (null,?,?,?,null,null)'
  const arr = [attrname, catid, attrsel]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '添加分类参数成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '添加分类参数失败'
      })
    }
  })
})

// 分类参数编辑预更新
router.get('/preUpdateParams', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const attrid = a.searchParams.get('attr_id')
  const catid = a.searchParams.get('cat_id')
  const sql = 'select * from cateparams where attr_id=? and cat_id=?'
  sqlClient(sql, [attrid, catid], result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '分类参数预更新失败'
      })
    }
  })
})

// 分类参数修改
router.get('/updateParams', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const attrid = a.searchParams.get('attr_id')
  const catid = a.searchParams.get('cat_id')
  const attrname = a.searchParams.get('attr_name')
  const attrvals = a.searchParams.get('attr_vals')
  const sql = 'update cateparams set attr_name=?,attr_vals=? where attr_id=? and cat_id=?'
  const arr = [attrname, attrvals, attrid, catid]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '分类参数修改成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '分类参数修改失败'
      })
    }
  })
})

// 分类参数删除
router.get('/deleteParamsById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const attrid = a.searchParams.get('attr_id')
  const sql = 'delete from cateparams where attr_id=?'
  const arr = [attrid]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '分类参数删除成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '分类参数删除失败'
      })
    }
  })
})

// 菜品列表
router.get('/foods', (req, res) => {
  const sql = 'select * from food where foods_id '
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 401,
        msg: '获取菜品列表失败'
      })
    }
  })
})

//  菜品信息查询
router.get('/foodsearch', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const search = a.searchParams.get('search')
  const sql = "select * from food where concat(`foods_name`,`foods_price`,`foods_weight`) like '%" + search + "%'"
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result

      })
    } else {
      res.send({
        status: 500,
        msg: '暂无数据'
      })
    }
  })
})

// 菜品删除
router.get('/deleteFoodById', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const foodsid = a.searchParams.get('foods_id')
  const sql = 'delete from food where foods_id=?'
  const arr = [foodsid]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '删除菜品成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '删除菜品失败'
      })
    }
  })
})

/**
 * 上传图片
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var createFolder = function (folder) {
  try {
    fs.accessSync(folder)
  } catch (e) {
    fs.mkdirSync(folder)
  }
}

var uploadFolder = './upload/'
createFolder(uploadFolder)
var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), function (req, res, next) {
  var file = req.file
  console.log('文件类型：%s', file.mimetype)
  console.log('原始文件名：%s', file.originalname)
  console.log('文件大小：%s', file.size)
  console.log('文件保存路径：%s', file.path)
  res.json({ res_code: '0', name: file.originalname, url: file.path })
})

// 添加菜品
router.get('/addfood', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const foodsname = a.searchParams.get('foods_name')
  const foodsprice = a.searchParams.get('foods_price')
  const catid = a.searchParams.get('cat_id')
  const foodsnumber = a.searchParams.get('foods_number')
  const foodsweight = a.searchParams.get('foods_weight')
  const foodsintroduce = a.searchParams.get('foods_introduce')
  const addtime = a.searchParams.get('add_time')
  const updtime = a.searchParams.get('upd_time')
  const pics = a.searchParams.get('pics')
  const attrs = a.searchParams.get('attrs')
  const sql = 'insert into food values (null,?,?,?,?,?,?,null,?,?,null,0,?,?)'
  const arr = [foodsname, foodsprice, catid, foodsnumber, foodsweight, foodsintroduce, addtime, updtime, pics, attrs]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '添加菜品成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '添加菜品失败'
      })
    }
  })
})

// 菜品修改
router.get('/updatefood', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const foodsid = a.searchParams.get('foods_id')
  const foodsname = a.searchParams.get('foods_name')
  const foodsprice = a.searchParams.get('foods_price')
  const catid = a.searchParams.get('cat_id')
  const foodsnumber = a.searchParams.get('foods_number')
  const foodsintroduce = a.searchParams.get('foods_introduce')
  const updtime = a.searchParams.get('upd_time')
  const pics = a.searchParams.get('pics')
  const attrs = a.searchParams.get('attrs')
  const sql = 'update food set foods_name=?,foods_price=?,cat_id=?,foods_number=?,foods_introduce=?,upd_time=?,pics=?,attrs=? where foods_id=?'
  const arr = [foodsname, foodsprice, catid, foodsnumber, foodsintroduce, updtime, pics, attrs, foodsid]
  sqlClient(sql, arr, result => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: '修改菜品成功'
      })
    } else {
      res.send({
        status: 500,
        msg: '修改菜品失败'
      })
    }
  })
})

// 菜品编辑预更新
router.get('/preUpdatefood', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const foodsid = a.searchParams.get('foods_id')
  const sql = 'select * from food where foods_id=?'
  sqlClient(sql, [foodsid], result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 500,
        msg: '菜品预更新失败'
      })
    }
  })
})

// 订单列表
router.get('/order', (req, res) => {
  const sql = 'select * from orders where order_id'
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result
      })
    } else {
      res.send({
        status: 401,
        msg: '获取订单列表失败'
      })
    }
  })
})

//  订单查询

router.get('/ordersearch', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const search = a.searchParams.get('search')
  const sql = "select * from orders where concat(`order_number`) like '%" + search + "%'"
  sqlClient(sql, null, result => {
    if (result.length > 0) {
      res.send({
        status: 200,
        result

      })
    } else {
      res.send({
        status: 500,
        msg: '暂无数据'
      })
    }
  })
})
module.exports = router
