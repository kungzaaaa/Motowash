export function calculateDeposit(totalPrice: number, depositPercentage: number = 0.4): number {
  if (totalPrice < 0) throw new Error('Total price cannot be negative');
  if (depositPercentage < 0 || depositPercentage > 1) {
    throw new Error('Deposit percentage must be between 0 and 1');
  }
  // Standard rounding to 2 decimal places if needed, but returning full number for now
  return Math.round(totalPrice * depositPercentage);
}

export function calculateRemaining(totalPrice: number, depositAmount: number): number {
  if (totalPrice < 0 || depositAmount < 0) throw new Error('Values cannot be negative');
  if (depositAmount > totalPrice) throw new Error('Deposit cannot exceed total price');
  return totalPrice - depositAmount;
}
