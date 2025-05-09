export default {
  /**
   * 计算用户任务总数和总 ISK 奖励金额，仅计算状态为 "已结算" 的任务
   */
  calculateSummary: async function() {
    try {
      // 获取任务数据，如果数据不存在，则默认为空数组
      const data = get_poster_log.data || [];

      // 筛选出状态为 "已结算" 的任务，仅统计已结算任务
      const settledTasks = data.filter(item => item.status === "已结算");

      // 计算已结算任务数量
      const total_tasks = settledTasks.length;

      // 计算已结算任务的 ISK 总金额，若 reward_amount 非数字则按 0 处理
      const total_isk = settledTasks.reduce((acc, item) => acc + (Number(item.reward_amount) || 0), 0);

      // 构建结果对象，包括任务总数和 ISK 总金额（格式化后的 ISK 金额）
      const result = {
        total_tasks: total_tasks,
        total_isk: total_isk,
      };

      // 将结果存储到 store 中，方便其他组件使用
      storeValue("userSummary", result);

      // 返回结果对象
      return result;

    } catch (error) {
      // 捕获并打印错误信息，防止应用崩溃
      console.error("Error in calculateSummary:", error);

      // 返回默认结果对象，避免 undefined 问题
      return {
        total_tasks: 0,
        total_isk: "0"
      };
    }
  }
}
