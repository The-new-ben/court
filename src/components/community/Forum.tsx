import React, { useEffect, useState } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Thread {
  id: string;
  caseId: string;
  title: string;
  comments: Comment[];
}

export default function Forum() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    fetch('/api/community/threads')
      .then(res => res.json())
      .then(data => setThreads(data))
      .catch(err => console.error('Failed to load threads', err));
  }, []);

  if (threads.length === 0) {
    return <div className="p-4 text-center text-gray-500">אין דיונים זמינים.</div>;
  }

  return (
    <div className="space-y-6">
      {threads.map(thread => (
        <div key={thread.id} className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">
            {thread.title}{' '}
            <a
              href={`/cases/${thread.caseId}`}
              className="text-blue-600 hover:underline"
            >
              תיק {thread.caseId}
            </a>
          </h2>
          <ul className="mt-2 space-y-2">
            {thread.comments.map(comment => (
              <li key={comment.id} className="border-t pt-2">
                <p className="text-sm text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-400">{comment.author}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
