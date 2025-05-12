export default {
  /**
   * 解析任务文本并生成任务对象，`posted_at` 字段改为 Unix 时间戳 (毫秒)
   */
  parseTaskLines: () => {
    const raw = input_raw_text.text || "";
    const lines = raw.trim().split("\n");
    const currentUser = appsmith.store.username;
    const configList = get_reward_config.data || [];
    const dbRecords = query_all_tasks.data || [];

    const errors = [];
    const tempParsed = [];

    const parsed = lines.map((line, index) => {
      const regex = /^\[(.+?)\]\[(\d+)M\]\[(.+?)\]\s+坐标\s+\d+\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})\s*-\s*(.+)$/;
      const match = line.match(regex);

      if (!match) {
        errors.push(`❌ 第 ${index + 1} 行格式错误`);
        return { error: true, raw: line };
      }

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

      const taskName = taskNameRaw.trim();
      const rewardAmount = parseInt(rewardStr) * 1000000;
      const postcharacter = postcharacterRaw.trim();
      const tag = `[${taskName}][${rewardStr}M][${posterTag}]`;

      // ✅ 构建 Unix 时间戳 (毫秒)
      const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
      const postedAt = new Date(dateStr).getTime(); // Unix 时间戳 (毫秒)

      let statusText = "✅ 识别成功";

      // 检查任务名称是否存在于奖励配置中
      const config = configList.find(cfg => cfg.task_name.trim() === taskName);

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
       * ✅ 检查数据库中的重复任务（使用 Unix 时间戳对比）
       */
      const isDbDuplicate = dbRecords.some(entry => {
        const entryPostedAt = Number(entry.posted_at);
        return (
          entry.task_name.trim() === taskName &&
          entry.postcharacter.trim() === postcharacter &&
          entry.star_system.trim() === starSystem &&
          entryPostedAt === postedAt
        );
      });

      /**
       * ✅ 本地数据重复检查（使用 Unix 时间戳对比）
       */
      const isLocalDuplicate = tempParsed.some(entry =>
        entry.task_name === taskName &&
        entry.postcharacter === postcharacter &&
        entry.star_system === starSystem &&
        entry.posted_at === postedAt
      );

      // 更新状态为重复任务
      if (isLocalDuplicate || isDbDuplicate) {
        statusText = "❌ 重复任务";
      }

      // 识别状态是否允许录入
      const canRecord = statusText === "✅ 识别成功" ? "是" : "否";

      // 构建任务对象
      const parsedRow = {
        task_name: taskName,
        reward_amount: rewardAmount,
        tag,
        star_system: starSystem,
        constellation,
        region,
        posted_at: postedAt, // ✅ Unix 时间戳 (毫秒)
        poster: posterTag,
        postcharacter,
        status: "待接受",
        "能否录入": canRecord,
        "识别状态": statusText
      };

      tempParsed.push(parsedRow);
      return parsedRow;
    });

    if (errors.length > 0) {
      showAlert(errors.join("\n"), "error");
      return;
    }

    // ✅ 将解析后的任务列表存储到 Appsmith 全局存储
    storeValue("parsed_tasks", parsed);
    showAlert("✅ 解析成功！", "success");
  }
};