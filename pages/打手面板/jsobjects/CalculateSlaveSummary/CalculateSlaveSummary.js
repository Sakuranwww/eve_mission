export default {
  /**
   * 计算已结算任务总数和总 ISK 奖励金额
   */
  calculateSlaveSummary: async function() {
    try {
      const data = query_task_log.data || [];

      // 筛选出 status 为 "已结算" 的任务
      const settledTasks = data.filter(item => item.status === "已结算");

      const total_tasks = settledTasks.length;
      const total_isk = settledTasks.reduce((acc, item) => acc + (Number(item.reward_amount) || 0), 0);

      const result = {
        total_tasks: total_tasks,
        total_isk: total_isk
      };

      // 将结果存储到 store 中
      await storeValue("slaveSummary", result);

      return result;

    } catch (error) {
      console.error("Error in calculateSummary:", error);
      return {
        total_tasks: 0,
        total_isk: 0
      };
    }
  }
};