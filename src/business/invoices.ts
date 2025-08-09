import { getTimeEntriesByClient, TimeEntry } from './billing';

export interface Invoice {
  id: string;
  clientId: string;
  entries: TimeEntry[];
  rate: number;
  total: number;
  issuedAt: Date;
}

const invoices: Invoice[] = [];

export function generateInvoice(clientId: string, rate: number): Invoice {
  const entries = getTimeEntriesByClient(clientId);
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const invoice: Invoice = {
    id: `${clientId}-${Date.now()}`,
    clientId,
    entries,
    rate,
    total: totalHours * rate,
    issuedAt: new Date(),
  };

  invoices.push(invoice);
  return invoice;
}

export function listInvoices(clientId?: string): Invoice[] {
  return clientId ? invoices.filter(inv => inv.clientId === clientId) : [...invoices];
}
