/**
 * Utility function to format a date to a relative time string.
 * @param date - The date to format.
 * @returns A string like "2 hours ago" or "1 day ago".
 */
export function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44); // Average days in a month

  if (months > 0) return `${months} ${months === 1 ? "month" : "months"} ago`;
  if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (minutes > 0)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  return "just now";
}
