export default {
  /**
   * 解析任务文本并生成任务对象
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

    const errors = [];
    const tempParsed = [];

    const parsed = lines.map((line, index) => {
      // 正则表达式解析任务格式
      const regex = /^\[(.+?)\]\[(\d+)M\]\[(.+?)\]\s+坐标\s+\d+\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})\s*-\s*(.+)$/;
      const match = line.match(regex);

      // 检查格式是否匹配
      if (!match) {
        errors.push(`❌ 第 ${index + 1} 行格式错误`);
        return { error: true, raw: line };
      }

      // 匹配字段拆解
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

      // 字段规范化
      const taskName = taskNameRaw.trim();
      const rewardAmount = parseInt(rewardStr) * 1000000;
      const postcharacter = postcharacterRaw.trim();
      const tag = `[${taskName}][${rewardStr}M][${posterTag}]`;

      // 构建时间字符串，默认格式为 UTC 时间
      const postedAt = `${year}-${month}-${day} ${hour}:${minute}:00`;

      // 默认状态为识别成功
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
       * ✅ 检查数据库中的重复任务
       * - 对比任务名称、发布角色、发布时间、星系
       */
      const isDbDuplicate = dbRecords.some(entry => {
        const entryPostedAt = FormatDate.formatDate(entry.posted_at);
        return (
          entry.task_name.trim() === taskName &&
          entry.postcharacter.trim() === postcharacter &&
          entry.star_system.trim() === starSystem &&
          entryPostedAt === postedAt
        );
      });

      /**
       * ✅ 本地数据重复检查
       * - 对比任务名称、发布角色、发布时间、星系
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
        posted_at: postedAt,
        poster: posterTag,
        postcharacter,
        status: "待接受",
        "能否录入": canRecord,
        "识别状态": statusText
      };

      // 将任务对象存储到临时数组中，用于后续重复检查
      tempParsed.push(parsedRow);
      return parsedRow;
    });

    // 如果存在格式错误，显示警告信息
    if (errors.length > 0) {
      showAlert(errors.join("\n"), "error");
      return;
    }

    // 将解析后的任务列表存储到 Appsmith 全局存储
    storeValue("parsed_tasks", parsed);
    showAlert("✅ 解析成功！", "success");
  }
};