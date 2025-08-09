import React from 'react';
import { listInvoices } from '../../business/invoices';

export default function BillingDashboard() {
  const invoices = listInvoices();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Billing Reports</h2>
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th className="px-2 py-1">Invoice</th>
            <th className="px-2 py-1">Client</th>
            <th className="px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td className="border px-2 py-1">{inv.id}</td>
              <td className="border px-2 py-1">{inv.clientId}</td>
              <td className="border px-2 py-1">${inv.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
