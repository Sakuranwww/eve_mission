export default {
  /**
   * 格式化 ISK 金额，使用千分位分隔符
   * @param {number|string} amount - 需要格式化的金额
   * @returns {string} 格式化后的金额字符串
   */
  formatISK: function(amount) {
    return (!amount || isNaN(amount)) ? "0" : Number(amount).toLocaleString();
  }
};