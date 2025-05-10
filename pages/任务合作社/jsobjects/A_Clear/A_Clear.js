export default {
  /**
   * 页面加载时清空 currentTab 状态
   */
  clearCurrentTab: async function() {
    await storeValue("currentTab", "");
  }
};