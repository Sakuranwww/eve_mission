export default {
  /**
   * 返工选中的任务（支持多行，状态为 "已完成"）
   */
  reworkSelectedTasks: async () => {
    const selectedRows = TaskTable.selectedRows || [];

    // 检查是否选择了任务
    if (selectedRows.length === 0) {
      showAlert("❌ 请先选择至少一行任务进行返工", "warning");
      return;
    }

    // 筛选出状态为 "已完成" 的任务
    const reworkRows = selectedRows.filter(row => row.status === "已完成");

    if (reworkRows.length === 0) {
      showAlert("❌ 未找到 '已完成' 状态的任务进行返工", "warning");
      return;
    }

    try {
      // 获取返工任务的行索引数组
      const reworkIndices = reworkRows.map(row => row.rowIndex);
      
      // 存储返工索引数组
      storeValue("reworkRowIndices", reworkIndices);

      // 执行返工操作
      await Rework.run();

      // 刷新数据源
      await query_task_log.run();

      // 显示成功信息
      showAlert(`✅ 成功返工 ${reworkRows.length} 条任务`, "success");

    } catch (error) {
      console.error("返工任务失败：", error);
      showAlert("❌ 返工失败", "error");
    }
  }
};