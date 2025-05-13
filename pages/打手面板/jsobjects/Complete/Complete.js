export default {
  markTasksCompleted: async () => {
    // 获取当前选中的任务
    const selected = TaskTable.selectedRows || [];

    // 保留状态为"已接受"或"返工"的任务
    const tasksToUpdate = selected.filter(row => 
      row.status === "已接受" || row.status === "返工"
    );

    // 若没有可更新的任务，提示用户
    if (tasksToUpdate.length === 0) {
      showAlert("❌ 没有选中任何可完成的任务（仅限 '已接受' 或 '返工' 状态）", "warning");
      return;
    }

    // 构建更新数据
    const updatePayload = tasksToUpdate.map(row => ({
      rowIndex: row.rowIndex,
      status: "已完成",
      compeleted_at: Date.now()
    }));

    try {
      await Completed.run({ updateRows: updatePayload });

      showAlert(`✅ 成功完成 ${updatePayload.length} 条任务`, "success");
      await query_task_log.run();
    } catch (error) {
      console.error("任务更新失败：", error);
      showAlert("❌ 任务更新失败", "error");
    }
  },
	
selectAllCompletableTasks: async () => {
  const data = TaskTable.tableData || [];

  // 选出状态为"已接受"或"返工"的行的索引
  const indices = data
    .map((row, index) => (row.status === "已接受" || row.status === "返工" ? index : null))
    .filter(index => index !== null);

  // 存入 store 用于 Appsmith 的 selectedRowIndices 控制
  await storeValue("selectedIndices", indices);
}
}