const express = require('express')
const router = express.Router()
const sqlClient = require('./config')
const jwt = require('jsonwebtoken')
// const url = require('url')

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
  const sql = "select * from user where concat(`username`,`mobile`,`email`,`mg_state`,`role_name`) like '%" +
        search + "%'"
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
module.exports = router
