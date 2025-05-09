export default {
  /**
   * 将 Unix 时间戳（毫秒）转换为 YYYY-MM-DD HH:MM:SS 格式
   * @param {number} timestamp - Unix 时间戳（毫秒）
   * @returns {string} - 格式化后的时间字符串
   */
  formatTimestamp: (timestamp) => {
    if (!timestamp || typeof timestamp !== "number") {
      return "0000-00-00 00:00:00";
    }

    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
    const second = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },

  /**
   * 解析任务文本并检查重复性
   */
  parseTaskLines: () => {
    // 1. 获取原始输入文本
    const raw = input_raw_text.text || "";
    const lines = raw.trim().split("\n");

    // 2. 获取当前登录用户名
    const currentUser = appsmith.store.username;

    // 3. 获取奖励配置与数据库中已存在的任务列表
    const configList = get_reward_config.data || [];
    const dbRecords = query_all_tasks.data || [];

    const errors = [];        // 存储格式错误行信息
    const tempParsed = [];    // 存储当前导入过程中解析出的任务

    /**
     * 统一格式化 `dbRecords` 中的 `posted_at` 字段
     * 将 Unix 时间戳（毫秒）转换为 `YYYY-MM-DD HH:MM:SS` 格式
     */
    const formattedDbRecords = dbRecords.map(record => ({
      ...record,
      posted_at: this.formatTimestamp(record.posted_at)
    }));

    console.log("✅ 转换后的 dbRecords 数据: ", formattedDbRecords);

    // 4. 遍历每一行文本
    const parsed = lines.map((line, index) => {
      // 使用正则解析任务格式（[]+坐标+星系等字段）
      const regex = /^\[(.+?)\]\[(\d+)M\]\[(.+?)\]\s+坐标\s+\d+\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})\s*-\s*(.+)$/;
      const match = line.match(regex);

      // 5. 格式校验失败则返回错误对象
      if (!match) {
        errors.push(`❌ 第 ${index + 1} 行格式错误`);
        return { error: true, raw: line };
      }

      // 6. 拆解匹配字段
      const [
        _,
        taskNameRaw,
        rewardStr,
        posterTag,
        starSystem,
        constellation,
        region,
        year, month, day,
        hour, minute,
        postcharacterRaw
      ] = match;

      // 7. 字段规范化
      const taskName = taskNameRaw.trim().normalize();
      const rewardAmount = parseInt(rewardStr) * 1000000;
      const postedAt = `${year}-${month}-${day} ${hour}:${minute}:00`;
      const postcharacter = postcharacterRaw.trim();
      const tag = `[${taskName}][${rewardStr}M][${posterTag}]`;

      // 8. 默认状态为识别成功
      let statusText = "✅ 识别成功";

      // 9. 校验任务是否存在于配置中，酬劳是否一致，poster是否合法，角色名长度限制
      const config = configList.find(cfg =>
        cfg.task_name.trim().normalize() === taskName
      );

      if (!config) {
        statusText = "❌ 任务名错误";
      } else if (config.reward_amount !== rewardAmount) {
        statusText = "❌ 酬劳错误";
      } else if (posterTag !== currentUser) {
        statusText = "❌ 发布玩家错误";
      } else if (postcharacter.length > 30) {
        statusText = "❌ 发布角色名过长";
      }

      /**
       * 10. 判断是否在当前粘贴内容中重复（任务名+角色+时间）
       */
      const isLocalDuplicate = tempParsed.some(entry =>
        entry.task_name.trim().normalize() === taskName &&
        entry.postcharacter === postcharacter &&
        entry.posted_at === postedAt
      );

      /**
       * 11. 判断是否与数据库中任务重复（任务名+角色+时间）
       */
      const isDbDuplicate = formattedDbRecords.some(entry => {
        const isDuplicate = (
          entry.task_name.trim().normalize() === taskName &&
          entry.postcharacter.trim() === postcharacter &&
          entry.posted_at === postedAt
        );

        if (isDuplicate) {
          console.log(`⚠️ 数据库中的重复任务 - 任务名: ${taskName}, 角色: ${postcharacter}, 时间: ${postedAt}`);
        }

        return isDuplicate;
      });

      // 12. 如果存在重复任务，标记状态为 "❌ 重复任务"
      if (isLocalDuplicate || isDbDuplicate) {
        statusText = "❌ 重复任务";
      }

      // 13. 只有状态为识别成功的才允许录入
      const canRecord = statusText === "✅ 识别成功" ? "是" : "否";

      // 14. 构建解析后的对象
      const parsedRow = {
        task_name: taskNameRaw,
        reward_amount: rewardAmount,
        tag,
        star_system: starSystem,
        constellation,
        region,
        posted_at: postedAt,
        poster: posterTag,
        postcharacter,
        status: "待接受",
        "能否录入": canRecord,
        "识别状态": statusText
      };

      // 15. 加入当前解析列表，用于后续查重
      tempParsed.push(parsedRow);
      return parsedRow;
    });

    // 16. 有格式错误就直接报错退出
    if (errors.length > 0) {
      showAlert(errors.join("\n"), "error");
      return;
    }

    // 17. 最终写入 store
    storeValue("parsed_tasks", parsed);
    showAlert("✅ 解析成功！", "success");
  }
};