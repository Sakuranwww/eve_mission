export default {
  /**
   * 清空已解析的任务数据
   * 将 parsed_tasks 存储中的任务列表重置为空数组
   */
  clearParsedTasks: () => {
    storeValue("parsed_tasks", []);
  }
};