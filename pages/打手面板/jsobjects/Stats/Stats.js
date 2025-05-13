export default {
  /**
   * 拉取已完成任务数据，按 poster 分组统计数量和总报酬，并展示弹窗
   */
  showStatsModal: async () => {
    // 1. 运行任务查询（刷新数据）
    await query_task_log.run();

    // 2. 获取查询结果
    const allTasks = query_task_log.data || [];

    // 3. 过滤状态为"已完成"的任务
    const completedTasks = allTasks.filter(row => row.status === "已完成");

    // 4. 按 poster 分组，累计任务数量和奖励总额
    const statsMap = {};
    completedTasks.forEach(row => {
      const poster = row.poster;
      const rewardStr = row.reward_amount || "";

      // 提取 reward 字符串中的数字部分（去除逗号和单位）
      const rewardNum = typeof rewardStr === "string"
        ? parseInt(rewardStr.replace(/[^0-9]/g, ""))
        : Number(rewardStr) || 0;

      if (!statsMap[poster]) {
        statsMap[poster] = { count: 0, totalReward: 0 };
      }

      statsMap[poster].count += 1;
      statsMap[poster].totalReward += rewardNum;
    });

    // 5. 整理为表格展示格式
    const result = Object.entries(statsMap).map(([poster, stats]) => ({
      poster,
      count: stats.count,
      total_reward: stats.totalReward
    }));

    // 6. 计算所有 poster 的总 ISK 金额
    const total = result.reduce((sum, entry) => sum + entry.total_reward, 0);

    // 7. 存储结果用于展示
    storeValue("posterStats", result);
    storeValue("totalPosterReward", total);

    // 8. 弹出统计结果 modal
    showModal("Modal_Stats");
  }
};