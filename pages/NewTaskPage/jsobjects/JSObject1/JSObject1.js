export default {
  /**
   * 将 Unix 时间戳（毫秒）转换为 YYYY-MM-DD HH:MM:SS 格式
   * @param {number} timestamp - Unix 时间戳（毫秒）
   * @returns {string} - 格式化后的时间字符串
   */
  convertTimestamp: (timestamp) => {
    if (!timestamp || typeof timestamp !== "number") {
      console.log("Invalid timestamp:", timestamp);
      return "0000-00-00 00:00:00";
    }

    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
    const second = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },

  /**
   * 转换 query_all_tasks 数据中的 `posted_at` 字段
   */
  convertAllTimestamps: () => {
    const data = query_all_tasks.data || [];

    const formattedData = data.map((item) => {
      return {
        ...item,
        posted_at: this.convertTimestamp(item.posted_at)  // ✅ 使用 this
      };
    });

    console.log("✅ 转换后的数据: ", formattedData);
    storeValue("formattedTasks", formattedData);
    showAlert("✅ 时间转换完成，数据已存储到 formattedTasks");
  }
};