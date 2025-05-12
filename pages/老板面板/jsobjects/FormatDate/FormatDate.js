export default {
  /**
   * 将 Unix 时间戳（毫秒）转换为 UTC 时间
   * @param {number|string} timestamp - Unix 时间戳（毫秒）
   * @returns {string} 格式化后的日期字符串（UTC 时间）
   */
  formatDate: function(timestamp) {
    if (!timestamp || isNaN(Number(timestamp))) {
      return "";
    }
    const date = new Date(Number(timestamp));

    // 格式化日期：YYYY-MM-DD HH:mm:ss
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};