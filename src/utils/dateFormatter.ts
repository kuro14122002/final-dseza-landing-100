/**
 * @deprecated Use the formatDate function from the translations utility instead.
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
 * @deprecated Use the formatDate function from the translations utility instead.
 * Formats time in 24-hour format: "HH:MM"
 * @param date - The date to format
 * @returns A formatted time string
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  
  return `${hours}:${minutes}`;
};

/**
 * General purpose date formatter
 * @param dateString - The date string to format
 * @param language - Language preference ('vi' or 'en')
 * @param includeTime - Whether to include time in the output
 * @returns A formatted date string
 */
export const formatDate = (dateString: string, language: string = 'vi', includeTime: boolean = false): string => {
  const date = new Date(dateString);
  
  if (language === 'en') {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
    return date.toLocaleDateString('en-US', options);
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let result = `${day}/${month}/${year}`;
    
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      result += ` ${hours}:${minutes}`;
    }
    
    return result;
  }
};
