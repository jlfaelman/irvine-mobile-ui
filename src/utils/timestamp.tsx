export function getDeviceTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function convertToUTC(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // The date object already represents the local time
  // toISOString() automatically converts to UTC
  return date.toISOString();
}

export function convertFromUTCToDevice(utcDateString: string): Date {
  const utcDate = new Date(utcDateString);
  const deviceTimeZone = getDeviceTimeZone();
  
  // Convert UTC to device timezone
  const deviceDate = new Date(utcDate.toLocaleString("en-US", { timeZone: deviceTimeZone }));
  
  return deviceDate;
}


export function formatToDeviceTimeZone(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const timeZone = getDeviceTimeZone();

  return new Intl.DateTimeFormat('default', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}


export function formatForDateTimeLocalInput(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function formatUTCTimeForDisplay(utcString: string): string {
    const date = new Date(utcString);
    return date.toISOString().replace('T', ' ').replace('Z', ' UTC');
}

export function getTimezoneOffset(): number {
    return new Date().getTimezoneOffset();
}

export function getTimezoneOffsetString(): string {
    const offset = getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}