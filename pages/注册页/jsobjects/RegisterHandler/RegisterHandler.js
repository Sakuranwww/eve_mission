export default {
  handleRegister: async () => {
    const username = new_username_input.text;
    const email = new_email.text;
    const password = new_password_input.text;
    const confirm = new_password_check.text;

    if (!username || !email || !password || !confirm) {
      showAlert("❌ 所有字段均为必填", "warning");
      return;
    }

    if (password !== confirm) {
      showAlert("❌ 两次密码不一致，请重新输入", "warning");
      return;
    }

    // ✅ 加入重复检查逻辑
    await check_user_query.run();
    if (check_user_query.data.length > 0) {
      showAlert("❌ 用户名或邮箱已存在", "error");
      return;
    }

    // ✅ 通过验证后，执行注册
    register_query.run(
      () => {
        showAlert("✅ 注册成功！", "success");
        navigateTo("LoginPage");
      },
      (err) => {
        showAlert("❌ 注册失败：用户名可能已存在", "error");
      }
    );
  }
}