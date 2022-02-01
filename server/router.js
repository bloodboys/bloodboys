const express = require('express')
const router = express.Router()
const sqlClient = require('./config')
const jwt = require('jsonwebtoken')
const url = require('url')

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
        msg: '登陆失败'
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
        msg: '预更新失败'
      })
    }
  })
})

// 用户编辑
router.get('/updateUser', (req, res) => {
  const a = new URL(req.url, 'http://localhost:3000')
  const id = a.searchParams.get('id')
  const email = a.searchParams.get('email')
  const mobile = a.searchParams.get('mobile')
  const sql = 'update user set email=?,mobile=? where id=?'
  const arr = [email, mobile, id]
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
module.exports = router
