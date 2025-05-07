export default {
  /**
   * 将 Unix 时间戳（毫秒）转换为 YYYY-MM-DD HH:MM:SS 格式
   * @param {number} timestamp - Unix 时间戳（毫秒）
   * @returns {string} - 格式化后的时间字符串
   */
  formatTimestamp: (timestamp) => {
    if (!timestamp || typeof timestamp !== "number") {
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
}