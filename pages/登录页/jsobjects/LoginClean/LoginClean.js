export default {
  /**
   * 登录清理函数 - 清空输入框并重置存储状态
   */
  loginClean: () => {
    // 使用 setter 方法清空输入框
    username_input.setValue("");
    password_input.setValue("");

    // 重置存储值
    storeValue('username', "");
    storeValue('role', "");
    storeValue('main_character', "");
  }
}