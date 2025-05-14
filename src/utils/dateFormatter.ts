
/**
 * Formats a date in Vietnamese format: "Thứ [day of week], DD/MM/YYYY"
 * @param date - The date to format
 * @returns A formatted date string
 */
export const formatDateVi = (date: Date): string => {
  const dayOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  
  return `${dayOfWeek[date.getDay()]}, ${day}/${month}/${year}`;
};

/**
 * Formats time in HH:MM format (24-hour)
 * @param date - The date to extract time from
 * @returns A formatted time string
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  
  return `${hours}:${minutes}`;
};
