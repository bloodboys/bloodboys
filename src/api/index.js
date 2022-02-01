import axios from '../utils/request'
import base from './base'

const api = {
  /**
     * 注册
     */
  register (params) {
    return axios.post(base.baseUrl + base.register, params)
  },
  /**
     * 登陆
     */
  login (params) {
    return axios.post(base.baseUrl + base.login, params)
  },
  /**
     * 商品列表
     */
  selectTbItemAllByPage (params) {
    return axios.get(base.baseUrl + base.selectTbItemAllByPage, {
      params
    })
  },
  /**
     * 商品总条数
     */
  total () {
    return axios.get(base.baseUrl + base.total)
  },
  /**
     * 用户信息查询
     */
  usersearch (params) {
    return axios.get(base.baseUrl + base.userSearch, {
      params
    })
  },
  /**
     * 类目选择
     */
  selectItemCategoryByParentId (params) {
    return axios.get(base.baseUrl + base.selectItemCategoryByParentId, {
      params
    })
  },
  /**
     * 添加用户
     */
  adduser (params) {
    return axios.get(base.baseUrl + base.adduser, {
      params
    })
  },
  /**
     * 商品删除
     */
  deleteUserById (params) {
    return axios.get(base.baseUrl + base.deleteUserById, {
      params
    })
  },
  /**
     * 预更新
     */
  preUpdateUser (params) {
    return axios.get(base.baseUrl + base.preUpdateUser, {
      params
    })
  },
  /**
     * 商品修改
     */
  updateUser (params) {
    return axios.get(base.baseUrl + base.updateUser, {
      params
    })
  },
  /**
     * 规格参数查询
     */
  selectItemParamAll (params) {
    return axios.get(base.baseUrl + base.selectItemParamAll, {
      params
    })
  },
  /**
     * 规格参数模糊查询
     */
  paramsSearch (params) {
    return axios.get(base.baseUrl + base.paramsSearch, {
      params
    })
  },
  /**
     * 左侧菜单权限
     */
  menus (params) {
    return axios.get(base.baseUrl + base.menus, {
      params
    })
  },

  /**
     * 用户列表
     */
  users (params) {
    return axios.get(base.baseUrl + base.users, {
      params
    })
  },

  /**
       * 用户状态修改
       */
  updateuserstate (params) {
    return axios.get(base.baseUrl + base.updateuserstate, {
      params
    })
  }

}

export default api
