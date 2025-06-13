export default {
  parseTaskLines: () => {
		query_all_tasks.run(); // 先运行查询任务
		
    const raw = input_raw_text.text || "";
    const lines = raw.trim().split("\n");

    const dbRecords = query_all_tasks.data || [];
    const parsed = [];
    const tempParsed = [];

    lines.forEach((line, index) => {
      const regex = /^\[(.+?)\]\[(\d+)M\]\[(.+?)\]\s+坐标\s+\d+\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+([^\s*]+)\*?\s+(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})\s*-\s*(.+)$/;
      const match = line.match(regex);

      if (!match) {
        parsed.push({
          error: true,
          raw: line,
          "识别状态": `❌ 第 ${index + 1} 行格式错误`,
          "能否录入": "否"
        });
        return;
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
      const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
      const postedAt = new Date(dateStr).getTime();

      let statusText = "";

      // 查找数据库中是否存在，并获取其 rowIndex
      const matched = dbRecords.find(item =>
        item.task_name?.trim() === taskName &&
        item.postcharacter?.trim() === postcharacter &&
        item.star_system?.trim() === starSystem &&
        Number(item.posted_at) === postedAt
      );

      const rowIndex = matched?.rowIndex ?? null;

      if (!matched || matched.status !== "待接受") {
        statusText = "❌ 不存在或已接受";
      }

      // 本地重复校验
      const isLocalDuplicate = tempParsed.some(entry =>
        entry.task_name === taskName &&
        entry.postcharacter === postcharacter &&
        entry.star_system === starSystem &&
        entry.posted_at === postedAt
      );

      if (!statusText && isLocalDuplicate) {
        statusText = "❌ 重复任务";
      }

      if (!statusText) {
        statusText = "✅ 可接受";

        tempParsed.push({
          task_name: taskName,
          postcharacter,
          star_system: starSystem,
          posted_at: postedAt
        });
      }

      parsed.push({
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
        rowIndex: rowIndex,
        "识别状态": statusText,
        "能否录入": statusText.startsWith("✅") ? "是" : "否"
      });
    });

    // 存储结果
    storeValue("parsed_tasks", parsed);

    const errors = parsed
      .filter(row => row["能否录入"] === "否")
      .map(row => row["识别状态"]);

    if (errors.length > 0) {
      showAlert(errors.join("\n"), "error");
    } else {
      showAlert("✅ 全部任务可接受", "success");
    }
  }
};