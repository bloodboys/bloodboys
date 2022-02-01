const base = {
  baseUrl: 'http://localhost:3000',
  register: '/api/register',
  login: '/api/login',
  selectTbItemAllByPage: '/api/backend/item/selectTbItemAllByPage', // 商品列表
  total: '/api/total', // 商品总条数
  userSearch: '/api/usersearch', // 用户信息查询
  selectItemCategoryByParentId: '/api/backend/itemCategory/selectItemCategoryByParentId', // 类目选择
  adduser: '/api/adduser', // 添加用户
  deleteUserById: '/api/deleteUserById', // 用户删除
  preUpdateUser: '/api/preUpdateUser', // 预更新
  updateUser: '/api/updateUser', // 商品修改
  selectItemParamAll: '/api/backend/itemParam/selectItemParamAll', // 规格参数查询
  paramsSearch: '/api/params/search', // 规格参数模糊查询
  menus: '/api/menus', // 左侧菜单权限
  users: '/api/users', // 用户列表
  updateuserstate: '/api/users/uId/state/type' // 用户状态修改
}

export default base
