export default {
  // 初始化所有过滤状态为 true
  initializeFilters: () => {
    storeValue("filter_pending", true);
    storeValue("filter_accepted", true);
    storeValue("filter_completed", true);
    storeValue("filter_settled", false);
    storeValue("filter_returned", true);
		storeValue("selectedIndices", "");
  },
}