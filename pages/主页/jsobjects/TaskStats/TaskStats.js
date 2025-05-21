export default {
  getPendingSummary: () => {
    const tasks = query_task_log.data || [];
    const pending = tasks.filter(t => t.status === "待接受");

    const totalReward = pending.reduce((sum, t) => sum + (t.reward_amount || 0), 0);
    const count = pending.length;

    return {
      totalReward,
      count
    }
  },
getPendingStatsByStarSystem: () => {
  const tasks = query_task_log.data || [];

  const pending = tasks.filter(t => t.status === "待接受");

  const resultMap = {};

  pending.forEach(t => {
    const system = t.star_system;
    const reward = t.reward_amount || 0;

    if (!resultMap[system]) {
      resultMap[system] = { totalReward: 0, count: 0 };
    }

    resultMap[system].totalReward += reward;
    resultMap[system].count += 1;
  });

  return Object.entries(resultMap).map(([star_system, { totalReward, count }]) => ({
    star_system,
    totalReward,
    count
  }));
},
  getPendingStatsByTaskType: () => {
    const allTasks = get_all_tasks.data || [];
    const taskMap = {};

    // 建立 task_name → task_type 映射
    allTasks.forEach(t => {
      taskMap[t.task_name] = t.task_type;
    });

    const tasks = query_task_log.data || [];
    const pending = tasks.filter(t => t.status === "待接受");

    const resultMap = {};

    pending.forEach(t => {
      const task_name = t.task_name;
      const task_type = taskMap[task_name] || "未分类";
      const reward = t.reward_amount || 0;

      if (!resultMap[task_type]) {
        resultMap[task_type] = { totalReward: 0, count: 0 };
      }

      resultMap[task_type].totalReward += reward;
      resultMap[task_type].count += 1;
    });

    return Object.entries(resultMap).map(([task_type, { totalReward, count }]) => ({
      task_type,
      totalReward,
      count
    }));
  },
 getPendingStatsByTaskName: () => {
    const tasks = query_task_log.data || [];

    const pending = tasks.filter(t => t.status === "待接受");

    const resultMap = {};

    pending.forEach(t => {
      const task_name = t.task_name;
      const reward = t.reward_amount || 0;

      if (!resultMap[task_name]) {
        resultMap[task_name] = { totalReward: 0, count: 0 };
      }

      resultMap[task_name].totalReward += reward;
      resultMap[task_name].count += 1;
    });

    return Object.entries(resultMap).map(([task_name, { totalReward, count }]) => ({
      task_name,
      totalReward,
      count
    }));
  }
}