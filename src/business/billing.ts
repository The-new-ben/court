export interface TimeEntry {
  lawyerId: string;
  clientId: string;
  date: Date;
  hours: number;
}

const timeEntries: TimeEntry[] = [];

export function logHours(lawyerId: string, clientId: string, hours: number, date: Date = new Date()): void {
  timeEntries.push({ lawyerId, clientId, hours, date });
}

export function getTimeEntriesByClient(clientId: string): TimeEntry[] {
  return timeEntries.filter(entry => entry.clientId === clientId);
}

export function getTimeEntries(): TimeEntry[] {
  return [...timeEntries];
}
