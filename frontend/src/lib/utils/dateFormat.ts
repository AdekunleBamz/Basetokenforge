import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format a timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

/**
 * Format a date with smart display (Today, Yesterday, or date)
 */
export function formatSmartDate(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, 'h:mm a')}`;
  }
  
  if (isYesterday(parsedDate)) {
    return `Yesterday at ${format(parsedDate, 'h:mm a')}`;
  }
  
  return format(parsedDate, 'MMM d, yyyy');
}

/**
 * Format a date for display in tokens/transactions
 */
export function formatTransactionDate(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(parsedDate, 'MMM d, yyyy h:mm a');
}

/**
 * Format a timestamp to ISO string
 */
export function toISOString(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return parsedDate.toISOString();
}

/**
 * Check if a date is within the last n days
 */
export function isWithinLastDays(date: Date | string | number, days: number): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - parsedDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}
