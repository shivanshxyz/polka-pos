/**
 * Generate payment data for QR code
 * @param amount Amount in DOT
 * @param recipient Recipient address
 * @returns Formatted payment data
 */
export const generatePaymentData = (amount: string, recipient: string) => {
  // Parse amount and convert to proper format (with 10 decimals for DOT)
  const amountValue = parseFloat(amount);
  if (isNaN(amountValue) || amountValue <= 0) {
    throw new Error('Invalid amount');
  }
  
  // Format data for QR code
  // This format can be adjusted based on what your target wallet supports
  return {
    chain: 'polkadot',
    recipient: recipient,
    amount: (amountValue * (10 ** 10)).toString(),
    symbol: 'DOT'
  };
}; 