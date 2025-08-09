import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface PollOption { id: string; text: string; votes: number; }
interface Poll { id: string; question: string; options: PollOption[]; }

export function PollWidget({ pollId }: { pollId: string }) {
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selected, setSelected] = useState('');
  const [results, setResults] = useState<PollOption[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/polls/${pollId}`);
      if (res.ok) {
        const data = await res.json();
        setPoll(data);
        setResults(data.options);
      }
    }
    load();
  }, [pollId]);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'judge')) {
      const timer = setInterval(async () => {
        const res = await fetch(`/polls/${pollId}/results`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.options);
        }
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [user, pollId]);

  const vote = async () => {
    if (!selected) return;
    const res = await fetch(`/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId: selected })
    });
    if (res.ok) {
      const data = await res.json();
      setResults(data.options);
    }
  };

  if (!poll) return <div>Loading...</div>;

  const total = results.reduce((sum, o) => sum + o.votes, 0);
  const showResults = user && (user.role === 'admin' || user.role === 'judge');

  return (
    <div>
      <h3>{poll.question}</h3>
      {poll.options.map(o => (
        <div key={o.id}>
          <label>
            <input
              type="radio"
              value={o.id}
              checked={selected === o.id}
              onChange={e => setSelected(e.target.value)}
              disabled={showResults}
            />
            {o.text}
          </label>
          {showResults && (
            <div style={{ background: '#eee', height: '8px', width: '100%' }}>
              <div
                style={{
                  background: '#3b82f6',
                  height: '8px',
                  width: total ? `${(results.find(r => r.id === o.id)?.votes || 0) / total * 100}%` : '0%'
                }}
              />
            </div>
          )}
        </div>
      ))}
      {!showResults && <button onClick={vote} disabled={!selected}>Vote</button>}
      {!showResults && total > 0 && (
        <div>
          {results.map(o => (
            <div key={o.id}>{o.text} - {o.votes}</div>
          ))}
        </div>
      )}
    </div>
  );
}
