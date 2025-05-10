export default {
  /**
   * 计算每个 acceptor 的任务总数和 ISK 总金额，仅计算状态为 "已完成" 的任务
   * 成功则弹出 Modal_Check_Out，失败则使用 showAlert 显示错误信息
   */
  calculateSummary: async function() {
    try {
      // 获取任务数据，如果数据不存在，则默认为空数组
      const data = Task_table.selectedRows || [];

      // 检查是否有数据
      if (data.length === 0) {
        throw new Error("当前没有选中的任务数据");
      }

      // 筛选出状态为 "已完成" 的任务，仅统计已完成任务
      const settledTasks = data.filter(item => item.status === "已完成");

      // 检查是否有 "已完成" 状态的任务
      if (settledTasks.length === 0) {
        throw new Error("没有状态为 '已完成' 的可结算任务");
      }

      // 构建汇总结果，以 acceptor 为键
      const summary = settledTasks.reduce((acc, item) => {
        const acceptor = item.acceptor || "Unknown";

        // 提取 reward_amount 中的 ISK 金额
        const rewardString = item.reward_amount || "0";
        const rewardMatch = rewardString.match(/([\d,]+) ISK/);
        const rewardAmount = rewardMatch ? parseInt(rewardMatch[1].replace(/,/g, ""), 10) : 0;

        // 初始化 acceptor 对象
        if (!acc[acceptor]) {
          acc[acceptor] = {
            acceptor,
            task_count: 0,
            total_isk: 0
          };
        }

        // 累加任务数量和 ISK
        acc[acceptor].task_count += 1;
        acc[acceptor].total_isk += rewardAmount;

        return acc;
      }, {});

      // 转换为数组格式，方便在 Table 中渲染
      const resultArray = Object.values(summary);

      // 检查是否有汇总数据
      if (resultArray.length === 0) {
        throw new Error("未找到可结算的任务数据");
      }

      // 将结果存储到 store 中
      storeValue("userSummary", resultArray);

      // 显示成功 Modal
      showModal("Modal_Check_Out");

      console.log("汇总数据：", resultArray);

      return resultArray;

    } catch (error) {
      console.error("Error in calculateSummary:", error.message);

      // 使用 showAlert 显示错误信息
      showAlert(error.message, "error");

      return [];
    }
  }
};