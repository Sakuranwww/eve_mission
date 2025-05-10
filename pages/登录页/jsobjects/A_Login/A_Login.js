export default {
  /**
   * 用户登录处理逻辑
   * - 检查用户名和密码是否匹配数据库中的数据
   * - 如果匹配成功，先清空现有用户数据，再存储新的用户信息并跳转页面
   * - 如果匹配失败，显示错误提示
   */
  handleLogin: async function() {
    try {
      // 执行登录检查查询
      await login_check.run();

      // 检查查询结果
      if (login_check.data.length > 0) {
        const user = login_check.data[0];

        // 存储新的用户信息
        await Promise.all([
          storeValue('username', user.username),
          storeValue('role', user.role),
          storeValue('main_character', user.main_character)
        ]);

        // 跳转到任务合作社页面
        navigateTo("任务合作社", {}, "SAME_WINDOW");

      } else {
        showAlert('用户名或密码错误', 'error');
      }
    } catch (err) {
      console.error("登录查询失败:", err);
      showAlert('查询失败，请检查连接', 'error');
    }
  }
};