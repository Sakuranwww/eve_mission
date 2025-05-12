export default {
  copyTaskInfo: (taskName) => {
    const record = get_all_tasks.data.find(t => t.task_name === taskName);

    if (!record) {
      showAlert(`未找到任务 "${taskName}" 的酬劳配置`, "warning");
      return;
    }

    const reward = record.reward_amount ? record.reward_amount / 1000000 + "M" : "未知金额";

    // 检查 username 是否存在
    const username = appsmith.store?.username;

    if (!username) {
      showAlert("❌ 用户名未设置，无法复制任务信息", "error");
      return;
    }

    const message = `[${taskName}][${reward}][${username}]`;

    // 复制到剪贴板
    copyToClipboard(message);

    // 显示 Alert
    showAlert(message, "success");
  }
}