export default {
  /**
   * 复制任务信息到剪贴板并显示成功提示
   * @param {string} taskName - 任务名称
   */
  copyTaskInfo: (taskName) => {
    // 根据任务名称查找任务配置信息
    const record = get_reward_config.data.find(t => t.task_name === taskName);

    // 如果找到对应的任务配置
    if (record) {
      // 将酬劳金额转为百万单位并添加 "M" 后缀
      const reward = record.reward_amount / 1000000 + "M";

      // 获取用户名，如果未登录则显示 "未知用户"
      const username = appsmith.store.username || "未知用户";

      // 构建复制文本内容，格式为 [任务名称][酬劳金额][用户名]
      const text = `[${taskName}][${reward}][${username}]`;

      // 将内容复制到剪贴板
      copyToClipboard(text);

      // 显示成功提示
      showAlert(`复制成功：${text}`, "success");
    } else {
      // 如果未找到任务配置，显示警告提示
      showAlert(`未找到任务 "${taskName}" 的酬劳配置`, "warning");
    }
  }
}