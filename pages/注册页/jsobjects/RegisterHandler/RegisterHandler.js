export default {
  handleRegister: async () => {
    const username = new_username_input.text;
    const email = new_email.text;
    const password = new_password_input.text;
    const confirm = new_password_check.text;

    if (!username || !email || !password || !confirm) {
      storeValue("register_status", "❌ 所有字段均为必填");
      return;
    }

    if (password !== confirm) {
      storeValue("register_status", "❌ 两次密码不一致，请重新输入");
      return;
    }

    // ✅ 加入重复检查逻辑
    await check_user_query.run();
    if (check_user_query.data.length > 0) {
      storeValue("register_status", "❌ 用户名或邮箱已存在");
      return;
    }

    // ✅ 通过验证后，执行注册
    register_query.run(
      () => {
        storeValue("register_status", "✅ 注册成功！");
        navigateTo("LoginPage");
      },
      (err) => {
        storeValue("register_status", "❌ 注册失败：用户名可能已存在");
      }
    );
  }
}