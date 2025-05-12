export default {
  /**
   * 解析 ISK 字符串，将 "30,000,000 ISK (30M)" 转换为数值 30000000
   */
  parseISK: function(iskString) {
    if (!iskString) return 0;

    const numericPart = iskString.split(" ")[0];
    const pureNumber = numericPart.replace(/,/g, "");

    return Number(pureNumber) || 0;
  },

  /**
   * 结算选中任务：筛选 "已完成" 状态并聚合数据，计算总 ISK
   */
  handleCheckout: function() {
    const selectedTasks = TaskTable.selectedRows;

    if (!selectedTasks || selectedTasks.length === 0) {
      showAlert("❌ 请先选择要结算的任务", "warning");
      return;
    }

    // 筛选 "已完成" 状态任务
    const completedTasks = selectedTasks.filter(task => task.status === "已完成");

    if (completedTasks.length === 0) {
      showAlert(" 未找到状态为 '已完成' 的任务", "info");
      return;
    }	

    // 聚合数据，按 `acceptor` 汇总，并初始化 `marked` 字段
    const summaryByAcceptor = completedTasks.reduce((acc, task) => {
      const acceptor = task.acceptor || "未知接收者";
      const rewardAmount = this.parseISK(task.reward_amount);

      if (!acc[acceptor]) {
        acc[acceptor] = { acceptor, total_tasks: 0, total_isk: 0, marked: false };
      }

      acc[acceptor].total_tasks += 1;
      acc[acceptor].total_isk += rewardAmount;

      return acc;
    }, {});

    // 转换为数组格式，供 Table 使用
    const summaryArray = Object.values(summaryByAcceptor);

    // 存储到 store 中
    storeValue("checkoutSummary", summaryArray);

    // 计算总 ISK
    this.calculateTotalISK();

    // 打开结算 Modal
    showModal("CheckoutModal");
  },

  /**
   * 切换当前行的标记状态
   * @param {Object} row - 当前行数据
   */
  toggleMark: function(row) {
    const summary = appsmith.store.checkoutSummary || [];

    const updatedSummary = summary.map(item => {
      if (item.acceptor === row.acceptor) {
        return { ...item, marked: !item.marked };
      }
      return item;
    });

    storeValue("checkoutSummary", updatedSummary);
  },

  /**
   * 计算 `checkoutSummary` 中的总 ISK 奖励
   */
  calculateTotalISK: function() {
    const summary = appsmith.store.checkoutSummary || [];
    const totalISK = summary.reduce((acc, item) => acc + item.total_isk, 0);

    storeValue("totalISK", totalISK);
  },

  /**
   * 复制当前行的 ISK 金额，仅输出纯数字格式
   * @param {Object} row - 当前行数据
   */
  copyISK: function(row) {
    if (!row || !row.total_isk) {
      showAlert("❌ 金额为空，无法复制", "warning");
      return;
    }

    // 解析 ISK 为纯数字
    const parsedISK = this.parseISK(row.total_isk);

    if (parsedISK === 0) {
      showAlert("❌ 金额为 0，无法复制", "warning");
      return;
    }

    copyToClipboard(parsedISK.toString());
    showAlert(`✅ 已复制：${parsedISK}`, "success");
  },
	copyUsername: function(row) {
    if (!row || !row.acceptor) {
      showAlert("❌ 玩家名为空，无法复制", "warning");
      return;
    }

    copyToClipboard(row.acceptor);
    showAlert(`✅ 已复制：${row.acceptor}`, "success");
  },
  /**
   * 复制结算信息
   */
  copyCheckoutInfo: () => {
    const checkoutData = CheckoutTable.tableData || [];
    const userData = check_user_query.data || [];
    
    if (checkoutData.length === 0) {
      showAlert("没有可结算的信息", "warning");
      return;
    }

    // 构建输出字符串
    let output = `<font size="14" color="#ffd98d00">`;

    checkoutData.forEach(entry => {
      const { acceptor, total_isk } = entry;

      // 查找 `character_id`，匹配 `main_character` 字段
      const user = userData.find(user => user.main_character === acceptor);
      const character_id = user ? user.character_id : "未知ID";

      output += `<a href="showinfo:1383//${character_id}">${acceptor}</a><br/>${total_isk}<br/><br/>`;
    });

    output += `</font>`;

    // 复制到剪贴板
    copyToClipboard(output);
    showAlert("结算信息已复制", "success");
  },
	  /**
   * 更新选中的任务状态为 "已结算"
   */
  finalCheckOut: async () => {
    const selectedRows = TaskTable.selectedRows || [];
    const completedTasks = selectedRows.filter(row => row.status === "已完成");

    if (!completedTasks.length) {
      showAlert("❌ 未找到可结算的 '已完成' 任务", "warning");
      return;
    }

    try {
      // 执行结算更新
      await Checkout.run({
        updateRows: completedTasks.map(row => ({
          "rowIndex": row.rowIndex,
          "status": "已结算"
        }))
      });

      showAlert(`✅ 成功结算 ${completedTasks.length} 条任务`, "success");

      // 关闭结算 Modal
      closeModal("CheckoutModal");

      // 刷新任务数据
      await query_task_log.run();

    } catch (error) {
      console.error("结算失败:", error);
      showAlert("❌ 结算失败", "error");
    }
  }
};