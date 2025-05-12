export default {
  handleLogin: async () => {
    const username = username_input.text;
    const password = password_input.text;

    // 执行查询
    try {
      await login_query.run();

      if (login_query.data.length > 0) {
        const userData = login_query.data[0];

        // 存储用户信息
        storeValue('username', username);
        storeValue('role', userData.role);
        storeValue('main_character', userData.main_character);

        // 跳转到主页
        navigateTo("主页", {}, "SAME_WINDOW");
      } else {
        showAlert('❌ 用户名或密码错误', 'error');
      }

    } catch (err) {
      showAlert('❌ 查询失败，请检查连接', 'error');
    }
  }
}