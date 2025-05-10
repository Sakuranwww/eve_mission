export default {
  /**
   * 清空注册页面输入框及状态提示
   * - 清除注册状态提示（register_status）
   * - 重置用户名、邮箱、密码和确认密码输入框
   */
  clearRegisterPage: () => {
    storeValue("register_status", "");  // 清除注册状态提示
    resetWidget("new_username_input");  // 重置用户名输入框
    resetWidget("new_email");           // 重置邮箱输入框
    resetWidget("new_password_input");  // 重置密码输入框
    resetWidget("new_password_check");  // 重置确认密码输入框
  },

  /**
   * 清空登录页面输入框及错误提示
   * - 清除登录错误提示（login_error）
   * - 重置用户名和密码输入框
   */
  clearLoginPage: () => {
    storeValue("login_error", "");      // 清除登录错误提示
    resetWidget("username_input");      // 重置用户名输入框
    resetWidget("password_input");      // 重置密码输入框
  },

  /**
   * 全局清除所有用户状态和输入框数据
   * - 清除注册状态、登录错误、用户名和角色
   */
  clearAll: () => {
    storeValue("register_status", "");  // 清除注册状态提示
    storeValue("login_error", "");      // 清除登录错误提示
    storeValue("username", "");         // 清除用户名
    storeValue("role", "");             // 清除用户角色
  }
};