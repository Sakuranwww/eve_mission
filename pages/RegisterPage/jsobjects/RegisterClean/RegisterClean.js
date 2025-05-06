export default {
  clearRegisterPage: () => {
    // 清除提示
    storeValue("register_status", "");

    // 清空注册输入框
    resetWidget("new_username_input");
    resetWidget("new_email");
    resetWidget("new_password_input");
    resetWidget("new_password_check");
  },

  clearLoginPage: () => {
    storeValue("login_error", "");
    resetWidget("username_input");
    resetWidget("password_input");
  },

  clearAll: () => {
    storeValue("register_status", "");
    storeValue("login_error", "");
    storeValue("username", "");
    storeValue("role", "");
    // 你可以继续扩展
  }
}