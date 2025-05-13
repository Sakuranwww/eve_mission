export default {
  checkAccess: () => {
    if (!appsmith.store.main_character) {
      showAlert("⚠️ 未检测到主角色，请找管理员手动登记", "warning");
      navigateTo("主页");
    }
  }
};