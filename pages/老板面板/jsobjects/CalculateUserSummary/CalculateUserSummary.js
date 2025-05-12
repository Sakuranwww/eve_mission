export default {
  /**
   * 计算用户任务总数和总 ISK 奖励金额
   */
  calculateSummary: async function() {
    try {
      const data = query_user_summary.data || [];
      const total_tasks = data.length;
      const total_isk = data.reduce((acc, item) => acc + (Number(item.reward_amount) || 0), 0);

      const result = {
        total_tasks: total_tasks,
        total_isk: total_isk
      };

      // 将结果存储到 store 中
      storeValue("userSummary", result);

      return result;

    } catch (error) {
      console.error("Error in calculateSummary:", error);
      return {
        total_tasks: 0,
        total_isk: 0
      };
    }
  },

  /**
   * 格式化 ISK 金额，带逗号分隔符
   */
  formatISK: function(amount) {
    if (!amount || isNaN(amount)) return "0";
    return new Intl.NumberFormat().format(amount);
  }
};