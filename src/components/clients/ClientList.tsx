import React, { useEffect, useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  history: string[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/clients', {
      credentials: 'include'
    const token = localStorage.getItem('hypercourt_token');
    fetch(`${API_URL}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load clients');
        }
        return res.json();
      })
      .then(data => setClients(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-2">
      {clients.map(client => (
        <div key={client.id} className="border rounded p-2">
          <div className="font-semibold">{client.name}</div>
          <div className="text-sm text-gray-600">{client.email} | {client.phone}</div>
        </div>
      ))}
    </div>
  );
}
