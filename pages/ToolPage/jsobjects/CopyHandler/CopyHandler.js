export default {
  copyTaskInfo: (taskName) => {
    const record = get_all_tasks.data.find(t => t.task_name === taskName);
    if (record) {
      const reward = record.reward_amount / 1000000 + "M";
      const username = appsmith.store.username || "未知用户";
      copyToClipboard(`[${taskName}][${reward}][${username}]`);
    } else {
      showAlert(`未找到任务 "${taskName}" 的酬劳配置`, "warning");
    }
  }
}