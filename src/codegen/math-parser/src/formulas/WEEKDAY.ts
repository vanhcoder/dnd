function WEEKDAY(dateStr: string, returnType: number = 1): number {
  // Kiểm tra nếu chuỗi ngày có thể chuyển thành Date hợp lệ
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(
      `WEEKDAY: Invalid date format: ${dateStr}. Please use 'YYYY-MM-DD' format.`
    );
  }
  if (![1, 2, 3].find((i) => i === returnType)) {
    throw new Error(`WEEKDAY: Unsupported returnType: ${returnType}`);
  }

  const day = date.getDay(); // Trả về số từ 0 (Chủ Nhật) đến 6 (Thứ Bảy)

  switch (returnType) {
    case 1:
      return day === 0 ? 7 : day; // Chủ Nhật = 7, Thứ Hai = 1, ..., Thứ Bảy = 6
    case 2:
      return day === 0 ? 7 : day; // Chủ Nhật = 7, Thứ Hai = 1, ..., Thứ Bảy = 6
    case 3:
      return (day + 6) % 7; // Thứ Hai = 0, Thứ Ba = 1, ..., Chủ Nhật = 6
    default:
      throw new Error(`WEEKDAY: Unsupported returnType: ${returnType}`);
  }
}

export default WEEKDAY;
