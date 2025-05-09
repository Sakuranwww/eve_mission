export default {
  createTasks: async () => {
    const tasks = appsmith.store.parsed_tasks || [];

    // 过滤出可以录入的任务
    const creatableTasks = tasks.filter(t => t["能否录入"] === "是");

    if (creatableTasks.length === 0) {
      showAlert("⚠️ 没有可新建的任务", "warning");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // 遍历逐条插入任务
    for (let row of creatableTasks) {
      try {
        await insert_tasks.run({
          status: row.status || "待接受",
          task_name: row.task_name,
          reward_amount: row.reward_amount,
          tag: row.tag,
          region: row.region,
          star_system: row.star_system,
          constellation: row.constellation,
          posted_at: row.posted_at,
          poster: row.poster,
          postcharacter: row.postcharacter,
          source_text: row.source_text || ""
        });
        successCount++;
      } catch (e) {
        failCount++;
        console.error("插入失败", row, e);
      }
    }

    // 移除已成功插入的任务
    const remainingTasks = tasks.filter(t => t["能否录入"] !== "是");
    storeValue("parsed_tasks", remainingTasks);

    // 弹出反馈提示
    showAlert(`✅ 成功创建 ${successCount} 个任务，失败 ${failCount} 个`, "success");

    // ⬇️ 插入后刷新数据库任务并重新解析一次
    try {
      await query_all_tasks.run();             // 刷新数据库中所有任务
      ParserJS.parseTaskLines();               // 再次解析原始文本
    } catch (err) {
      console.error("刷新或重新解析失败:", err);
    }
  }
}