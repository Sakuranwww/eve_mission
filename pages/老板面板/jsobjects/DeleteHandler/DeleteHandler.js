export default {
  /**
   * 删除选中的任务（仅限单行、状态为 "待接受"）
   */
  deleteSelectedTask: async () => {
    const selectedRows = TaskTable.selectedRows || [];

    // 检查是否选择了任务
    if (selectedRows.length === 0) {
      showAlert("❌ 请先选择一行任务进行删除", "warning");
      return;
    }

    // 检查是否选择了多行任务
    if (selectedRows.length > 1) {
      showAlert("❌ 一次只能删除一行任务，请重新选择", "warning");
      return;
    }

    // 获取第一个选中的任务
    const selectedTask = selectedRows[0];

    // 检查任务状态是否为 "待接受"
    if (selectedTask.status !== "待接受") {
      showAlert("❌ 只能删除 '待接受' 状态的任务", "warning");
      return;
    }

    try {
      // 将行索引转换为数字
      const deleteIndex = Number(selectedTask.rowIndex);

      // 存储当前删除行索引
      storeValue("deleteRowIndex", deleteIndex);

      // 执行删除操作
      await Delete.run();

      // 刷新数据源
      await query_task_log.run();

      // 显示成功信息
      showAlert(`✅ 成功删除任务 - 索引：${deleteIndex}`, "success");

    } catch (error) {
      showAlert("❌ 删除失败", "error");
    }
  }
};