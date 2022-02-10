const base = {
  baseUrl: 'http://localhost:3000',
  register: '/api/register',
  login: '/api/login', // 用户登录
  rights: '/api/rights', // 权限列表
  total: '/api/total', // 商品总条数
  userSearch: '/api/usersearch', // 用户信息查询
  selectItemCategoryByParentId: '/api/backend/itemCategory/selectItemCategoryByParentId', // 类目选择
  adduser: '/api/adduser', // 添加用户
  deleteUserById: '/api/deleteUserById', // 用户删除
  deleteRightById: '/api/deleteRightById', // 角色权限删除
  preUpdateUser: '/api/preUpdateUser', // 用户预更新
  updateUser: '/api/updateUser', // 用户修改
  roles: '/api/roles', // 角色列表
  paramsSearch: '/api/params/search', // 规格参数模糊查询
  menus: '/api/menus', // 左侧菜单权限
  users: '/api/users', // 用户列表
  updateuserstate: '/api/users/uId/state/type', // 用户状态修改
  returnRightById: '/api/returnRightById', // 返回角色权限
  allRightById: '/api/allRightById', // 获取所有权限列表
  UserRoleById: '/api/UserRoleById', // 用户角色对应id查找
  addrole: '/api/addrole', // 添加角色
  preUpdateUserRole: '/api/preUpdateUserRole', // 角色预更新
  updateUserRole: '/api/updateUserRole', // 角色修改
  deleteRoleById: '/api/deleteRoleById', // 角色删除
  foodscate: '/api/foodscate', // 菜品分类数据列表
  addfoodscate: '/api/addfoodscate', // 添加菜品分类
  preUpdateCate: '/api/preUpdateCate', // 编辑菜品分类预更新
  updateCate: '/api/updateCate', // 菜品分类名修改
  deleteCateById: '/api/deleteCateById' // 菜品分类删除
}

export default base
