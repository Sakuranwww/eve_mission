export default {
  AcceptTasks: async () => {
    const tasks = appsmith.store.parsed_tasks || [];

    // ✅ 过滤出可录入任务
    const creatable = tasks.filter(t => t["能否录入"] === "是" && typeof t.rowIndex === "number");

    if (creatable.length === 0) {
      showAlert("⚠️ 没有可接受的任务", "warning");
      return;
    }

    // ✅ 构造更新数据
    const payload = creatable.map(t => ({
      rowIndex: t.rowIndex,
      status: "已接受",
      acceptor: appsmith.store.main_character,
      accpet_at: Date.now()
    }));

    try {
      await accept_tasks.run({ updateRows: payload });
      showAlert(`✅ 成功接受 ${payload.length} 条任务`, "success");

      // ✅ 移除已处理的任务
      const remaining = tasks.filter(t => t["能否录入"] !== "是");
      storeValue("parsed_tasks", remaining);

      // ✅ 刷新数据库任务 & 重新解析（如你需要）
      await query_all_tasks.run();
      Parser.parseTaskLines();

    } catch (error) {
      console.error("接受任务失败：", error);
      showAlert("❌ 接受任务失败", "error");
    }
  }
};