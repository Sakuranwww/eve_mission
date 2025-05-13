export default {
  abandonSelectedTasks: async () => {
    const selected = TaskTable.selectedRows || [];

    // 仅保留状态为"已接受"的任务
    const toAbandon = selected.filter(row => row.status === "已接受" || row.status === "返工");

    if (toAbandon.length === 0) {
      showAlert("❌ 没有选中任何 '已接受' 的任务可放弃", "warning");
      return;
    }

    // 构造更新数据
    const updatePayload = toAbandon.map(row => ({
      rowIndex: row.rowIndex,
      status: "待接受",
      acceptor: "",
      accpet_at: "",
      compeleted_at: ""
    }));

    try {
      await Abandoned.run({ updateRows: updatePayload });

      showAlert(`✅ 成功放弃 ${updatePayload.length} 条任务`, "success");
      await query_task_log.run();
    } catch (error) {
      console.error("放弃任务失败：", error);
      showAlert("❌ 放弃失败", "error");
    }
  }
};