export function formatTime(timeStr) {
    // Create a date with the given time (today's date doesn't matter)
    const date = new Date(`1970-01-01T${timeStr}`);
    
    // Format to 12-hour clock with AM/PM
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
}