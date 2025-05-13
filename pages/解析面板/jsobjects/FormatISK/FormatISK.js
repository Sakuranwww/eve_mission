export default {
  /**
   * 格式化数字，添加逗号分隔符
   * @param {number} number - 要格式化的数字
   * @returns {string}
   */
  formatNumber: function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  /**
   * 格式化 ISK 金额，支持 K、M、B 单位
   * @param {number|string} amount - 要格式化的金额
   * @returns {string} 格式化后的金额字符串
   */
  formatISK: function(amount) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return "0 ISK (0)";
    }

    const numberAmount = Number(amount);
    const formattedISK = this.formatNumber(numberAmount) + " ISK";

    let unit = "";
    let formattedUnitValue = "";

    if (numberAmount >= 1000000000) {
      unit = "B";
      formattedUnitValue = (numberAmount / 1000000000).toFixed(2);
    } else if (numberAmount >= 1000000) {
      unit = "M";
      formattedUnitValue = (numberAmount / 1000000).toFixed(0);
    } else if (numberAmount >= 1000) {
      unit = "K";
      formattedUnitValue = (numberAmount / 1000).toFixed(0);
    } else {
      formattedUnitValue = numberAmount.toString();
    }

    return `${formattedISK} (${formattedUnitValue}${unit})`;
  }
};