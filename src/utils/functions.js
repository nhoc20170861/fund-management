export const formatAmountVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(amount);
};
// Helper function to format ALGO amounts similar to a wallet
export const formatAlgoAmount = (amount) => {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};
