/**
 * Format a date string to display date and time separately
 * @param dateString - ISO date string
 * @returns Object with formatted date and time
 */
export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

/**
 * Format a date string to display only the date
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date string to display only the time
 * @param dateString - ISO date string
 * @returns Formatted time string
 */
export function formatTime(dateString: string) {
  const date = new Date(dateString);
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date string to display full date and time in one line
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 */
export function formatFullDateTime(dateString: string) {
  const date = new Date(dateString);
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if a date string is in the past
 * @param dateString - ISO date string
 * @returns boolean indicating if date is in the past
 */
export function isPast(dateString: string) {
  return new Date(dateString) < new Date();
}

/**
 * Check if a date string is in the future
 * @param dateString - ISO date string
 * @returns boolean indicating if date is in the future
 */
export function isFuture(dateString: string) {
  return new Date(dateString) > new Date();
}
