export default {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 如果用户名和角色均存在，则返回 true；否则返回 false
   */
  isLoggedIn: () => {
    return !!appsmith.store.username && !!appsmith.store.role;
  },

  /**
   * 检查当前用户是否为管理员
   * @returns {boolean} 如果用户角色为 "admin"，返回 true；否则返回 false
   */
  isAdmin: () => {
    return appsmith.store.role === "admin";
  },

  /**
   * 检查当前用户是否为普通用户
   * @returns {boolean} 如果用户角色为 "user"，返回 true；否则返回 false
   */
  isUser: () => {
    return appsmith.store.role === "user";
  }
};