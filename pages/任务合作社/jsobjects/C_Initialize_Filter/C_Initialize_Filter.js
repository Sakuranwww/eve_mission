export default {
  /**
   * 初始化任务过滤状态
   * 将不同状态的任务过滤器设置初始值，用于控制任务列表显示的状态
   */
  initializeFilters: () => {
    // 待处理任务过滤器，默认显示
    storeValue("filter_pending", true);
    
    // 已接受任务过滤器，默认显示
    storeValue("filter_accepted", true);
    
    // 已完成任务过滤器，默认显示
    storeValue("filter_completed", true);
    
    // 已结算任务过滤器，默认隐藏
    storeValue("filter_settled", false);
    
    // 已退回任务过滤器，默认显示
    storeValue("filter_returned", true);
  },
}