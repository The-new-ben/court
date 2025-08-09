import React, { useState } from 'react';

interface QuoteFormProps {
  onCreated?: (quote: { id: string; client: string; details: string; amount: number; status: string }) => void;
}

export default function QuoteForm({ onCreated }: QuoteFormProps) {
  const [client, setClient] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !amount.trim()) {
      setError('כל השדות נדרשים');
      return;
    }

    const quote = { client, details, amount: parseFloat(amount), status };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      const saved = await response.json();
      onCreated?.(saved);
      setClient('');
      setDetails('');
      setAmount('');
      setStatus('draft');
      setError('');
    } catch {
      setError('שמירת הצעת המחיר נכשלה');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">שם לקוח</label>
        <input
          value={client}
          onChange={e => setClient(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
        <textarea
          value={details}
          onChange={e => setDetails(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">סכום</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">טיוטה</option>
          <option value="sent">נשלח</option>
          <option value="accepted">התקבל</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        שמור הצעה
      </button>
    </form>
  );
}


