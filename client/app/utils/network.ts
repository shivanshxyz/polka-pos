/**
 * Check if the network is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Format blockchain amount with proper decimals
 * @param amount Raw amount
 * @param decimals Decimal places
 */
export const formatAmount = (amount, decimals) => {
  if (typeof amount === 'bigint') {
    return Number(amount) / 10 ** decimals;
  }
  
  const numAmount = Number(amount);
  return numAmount / 10 ** decimals;
};

/**
 * Parse user input amount to blockchain format
 * @param amount User input amount
 * @param decimals Decimal places for the token
 */
export const parseAmount = (amount, decimals) => {
  const floatAmount = parseFloat(amount);
  if (isNaN(floatAmount)) return BigInt(0);
  
  // Convert to proper decimal representation
  return BigInt(Math.floor(floatAmount * (10 ** decimals)));
};
