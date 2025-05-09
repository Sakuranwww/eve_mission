export default {
  /**
   * 解析任务文本并检查重复性
   * - 从输入框中获取任务文本，逐行解析任务信息
   * - 检查任务格式、酬劳金额、发布玩家和角色名称是否有效
   * - 判断任务是否与数据库中已有任务或当前粘贴内容中的任务重复
   * - 将解析后的任务信息存储到 parsed_tasks 中，并标记其录入状态
   */
  parseTaskLines: () => {
    // 1. 获取原始输入文本并按行拆分
    const raw = input_raw_text.text || "";
    const lines = raw.trim().split("\n");

    // 2. 获取当前登录用户名
    const currentUser = appsmith.store.username;

    // 3. 获取奖励配置和数据库中已存在的任务列表
    const configList = get_reward_config.data || [];
    const dbRecords = get_poster_log.data || [];

    const errors = [];        // 用于存储格式错误信息
    const tempParsed = [];    // 用于存储当前解析过程中识别的任务

    /**
     * 4. 统一格式化数据库中的 `posted_at` 字段
     * - 将 Unix 时间戳转换为 `YYYY-MM-DD HH:MM:SS` 格式，方便比较
     */
    const formattedDbRecords = dbRecords.map(record => ({
      ...record,
      posted_at: D_Format_Time.formatTimestamp(record.posted_at)
    }));

    // 5. 遍历每一行文本，逐行解析
    const parsed = lines.map((line, index) => {
      // 正则表达式：匹配任务格式（任务名称、酬劳、发布玩家、坐标、星系、星座、星域、时间、角色名）
      const regex = /^\[(.+?)\]\[(\d+)M\]\[(.+?)\]\s+坐标\s+\d+\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})\s*-\s*(.+)$/;
      const match = line.match(regex);

      // 6. 如果格式校验失败，记录错误信息并返回
      if (!match) {
        errors.push(`❌ 第 ${index + 1} 行格式错误`);
        return { error: true, raw: line };
      }

      // 7. 拆解匹配到的字段，提取任务信息
      const [
        _,
        taskNameRaw,       // 任务名称
        rewardStr,         // 酬劳（单位：M）
        posterTag,         // 发布玩家
        starSystem,        // 星系
        constellation,     // 星座
        region,            // 星域
        year, month, day,  // 发布时间（年月日）
        hour, minute,      // 发布时间（时分）
        postcharacterRaw   // 发布角色名
      ] = match;

      // 8. 规范化字段
      const taskName = taskNameRaw.trim();
      const rewardAmount = parseInt(rewardStr) * 1000000;
      const postedAt = `${year}-${month}-${day} ${hour}:${minute}:00`;
      const postcharacter = postcharacterRaw.trim();
      const tag = `[${taskName}][${rewardStr}M][${posterTag}]`;

      let statusText = "✅ 识别成功";

      /**
       * 9. 校验任务信息
       * - 任务名是否存在于配置中
       * - 酬劳是否匹配
       * - 发布玩家是否为当前用户
       * - 角色名称长度限制
       */
      const config = configList.find(cfg => cfg.task_name === taskName);

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
       * 10. 判断是否为重复任务
       * - 当前粘贴内容中的重复任务检查
       * - 数据库中的重复任务检查
       */
      const isLocalDuplicate = tempParsed.some(entry =>
        entry.task_name === taskName &&
        entry.postcharacter === postcharacter &&
        entry.posted_at === postedAt
      );

      const isDbDuplicate = formattedDbRecords.some(entry =>
        entry.task_name === taskName &&
        entry.postcharacter === postcharacter &&
        entry.posted_at === postedAt
      );

      // 如果存在重复任务，则标记为重复
      if (isLocalDuplicate || isDbDuplicate) {
        statusText = "❌ 重复任务";
      }

      // 11. 判断任务是否可以录入
      const canRecord = statusText === "✅ 识别成功" ? "是" : "否";

      /**
       * 12. 构建解析后的任务对象
       */
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

      // 13. 将解析出的任务加入临时列表，用于后续查重
      tempParsed.push(parsedRow);
      return parsedRow;
    });

    // 14. 如果存在格式错误，弹出错误信息并终止解析过程
    if (errors.length > 0) {
      showAlert(errors.join("\n"), "error");
      return;
    }

    // 15. 将解析结果存储到 store 中，并弹出成功提示
    storeValue("parsed_tasks", parsed);
    showAlert("✅ 解析成功！", "success");
  }
};