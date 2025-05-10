export default {
  /**
   * 用户注册逻辑处理函数
   * - 检查必填字段是否填写完整
   * - 校验两次输入密码是否一致
   * - 检查用户名或邮箱是否已存在
   * - 插入新用户数据至数据库
   */
  handleRegister: async () => {
    // 获取用户输入的注册信息
    const username = new_username_input.text;
    const email = new_email.text;
    const password = new_password_input.text;
    const confirm = new_password_check.text;

    /**
     * 1. 检查必填字段是否填写完整
     */
    if (!username || !email || !password || !confirm) {
      storeValue("register_status", "❌ 所有字段均为必填");
      return;  // 终止后续逻辑
    }

    /**
     * 2. 校验两次输入的密码是否一致
     */
    if (password !== confirm) {
      storeValue("register_status", "❌ 两次密码不一致，请重新输入");
      return;  // 终止后续逻辑
    }

    /**
     * 3. 检查用户名或邮箱是否已存在
     * - 运行 `register_check` 查询数据库中的用户名或邮箱
     */
    await register_check.run();
    if (register_check.data.length > 0) {
      storeValue("register_status", "❌ 用户名或邮箱已存在");
      return;  // 终止后续逻辑
    }

    /**
     * 4. 插入新用户数据至数据库
     * - 如果注册成功，显示注册成功
     * - 如果注册失败，显示错误提示
     */
    register_insert.run(
      () => {
        storeValue("register_status", "✅ 注册成功！");
      },
      (err) => {
        storeValue("register_status", "❌ 注册失败：用户名可能已存在");
      }
    );
  }
};