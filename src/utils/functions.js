import configs from "configs";
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

// Render background color for avatar user
function stringToColor(string) {
  if (!string) return "#fe6f5e";
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
export function stringAvatar(name) {
  console.log("🚀 ~ stringAvatar ~ name:", name);
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name[0].toUpperCase(),
  };
}

export const isValidImageURL = (url) => {
  return /\.(jpg|jpeg|png|gif)$/.test(url);
};

// Hàm chuyển đổi timestamp thành chuỗi định dạng ngày
export function getDateFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // Timestamp tính theo giây, cần nhân với 1000
  return date.toISOString().split("T")[0]; // Trả về định dạng yyyy-mm-dd
}

// Nhóm các giao dịch theo ngày
export const getGroupedByDay = (transactions) => {
  const group = transactions.reduce((acc, tx) => {
    const date = getDateFromTimestamp(tx["round-time"]);
    acc[date] = (acc[date] || 0) + tx["payment-transaction"].amount;
    return acc;
  }, {});
  return group;
};

// Hàm lấy tuần từ timestamp
export function getWeekFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
  return startOfWeek.toISOString().split("T")[0]; // Trả về ngày đầu tuần
}

// Nhóm các giao dịch theo ngày
export const getGroupdByWeek = (transactions) => {
  const group = transactions.reduce((acc, tx) => {
    const date = getWeekFromTimestamp(tx["round-time"]);
    acc[date] = (acc[date] || 0) + tx["payment-transaction"].amount;
    return acc;
  }, {});
  return group;
};

// Hàm lấy tháng từ timestamp
export function getMonthFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toISOString().substring(0, 7); // Trả về định dạng yyyy-mm
}
