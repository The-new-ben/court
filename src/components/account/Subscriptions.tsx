import React, { useEffect, useState } from 'react';

interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  interval: string;
}

export default function Subscriptions() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/subscriptions/packages')
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(() => setPackages([]));
  }, []);

  const choosePackage = async (packageId: string) => {
    try {
      const res = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId })
      });
      if (res.ok) {
        setSelected(packageId);
        setMessage('נרשמת בהצלחה');
      } else {
        setMessage('שגיאה בהרשמה');
      }
    } catch {
      setMessage('שגיאה בחיבור');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">בחר חבילת מנוי</h2>
      {packages.map(pkg => (
        <div
          key={pkg.id}
          className={`border p-4 rounded flex items-center justify-between ${selected === pkg.id ? 'border-blue-500' : 'border-gray-200'}`}
        >
          <div>
            <p className="font-semibold">{pkg.name}</p>
            <p className="text-sm text-gray-600">{pkg.price}₪ / {pkg.interval}</p>
          </div>
          <button
            onClick={() => choosePackage(pkg.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            בחר
          </button>
        </div>
      ))}
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}

