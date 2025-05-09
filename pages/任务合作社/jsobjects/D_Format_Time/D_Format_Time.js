export default {
  /**
   * 将 Unix 时间戳（毫秒）转换为 YYYY-MM-DD HH:MM:SS 格式
   * - 如果传入的时间戳无效或不是数字，返回 "0000-00-00 00:00:00"
   * 
   * @param {number} timestamp - Unix 时间戳（毫秒）
   * @returns {string} 格式化后的时间字符串，格式为 YYYY-MM-DD HH:MM:SS
   */
  formatTimestamp: (timestamp) => {
    // 如果时间戳无效或不是数字，返回默认值
    if (!timestamp || typeof timestamp !== "number") {
      return "0000-00-00 00:00:00";
    }

    const date = new Date(timestamp);

    // 获取年份、月份、日期，并确保两位数格式
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    // 获取小时、分钟、秒数，并确保两位数格式
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
    const second = String(date.getUTCSeconds()).padStart(2, "0");

    // 返回格式化后的时间字符串
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },
};