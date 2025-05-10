export default {
  /**
   * 格式化 ISK 金额，显示千分位和 M/B 格式
   * @param {number|string} amount - 需要格式化的金额
   * @returns {string} 格式化后的金额字符串
   */
  formatISK: function(amount) {
    const num = Number(amount);
    if (isNaN(num) || num === 0) return "0 ISK ( 0M )";

    const iskFormatted = num.toLocaleString();
    let shortFormat = "";

    if (num >= 1000000000) {
      shortFormat = `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      shortFormat = `${(num / 1000000).toFixed(2)}M`;
    } else {
      shortFormat = `${num.toLocaleString()}`;
    }

    return `${iskFormatted} ISK ( ${shortFormat} )`;
  }
};