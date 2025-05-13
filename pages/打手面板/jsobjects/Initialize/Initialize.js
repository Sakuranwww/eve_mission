export default {
  // 初始化所有过滤状态为 true
  initializeFilters: () => {
    storeValue("filter_accepted", true);
    storeValue("filter_completed", false);
    storeValue("filter_settled", false);
    storeValue("filter_returned", true);
		storeValue("selectedIndices", "");
  },
}