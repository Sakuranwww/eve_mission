export default {
  /**
   * 批量创建任务
   * - 从 parsed_tasks 中筛选 "能否录入" 为 "是" 的任务进行插入
   * - 插入成功的任务会从 parsed_tasks 中移除，未插入成功的任务保留
   * - 插入完成后刷新数据库任务并重新解析原始文本
   */
  createTasks: async () => {
    const tasks = appsmith.store.parsed_tasks || [];

    // 过滤出可以录入的任务，仅保留 "能否录入" 为 "是" 的任务
    const creatableTasks = tasks.filter(t => t["能否录入"] === "是");

    // 如果没有可录入任务，弹出警告提示并终止操作
    if (creatableTasks.length === 0) {
      showAlert("⚠️ 没有可新建的任务", "warning");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // 遍历任务逐条插入数据库
    for (let row of creatableTasks) {
      try {
        // 执行插入任务操作，插入字段包括任务名称、酬劳金额、标签、星域等
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
        // 插入失败，记录失败数量并打印错误信息
        failCount++;
        console.error("插入失败", row, e);
      }
    }

    // 移除已成功插入的任务，仅保留未插入成功的任务
    const remainingTasks = tasks.filter(t => t["能否录入"] !== "是");
    storeValue("parsed_tasks", remainingTasks);

    // 显示插入结果反馈
    showAlert(`✅ 成功创建 ${successCount} 个任务，失败 ${failCount} 个`, "success");

    // 插入后刷新数据库任务并重新解析任务数据
    try {
      await get_poster_log.run();   // 刷新数据库中的任务数据
      D_Parse.parseTaskLines();     // 重新解析原始文本任务
    } catch (err) {
      console.error("刷新或重新解析失败:", err);
    }
  }
};