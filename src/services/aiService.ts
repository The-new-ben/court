import { API_BASE_URL } from '../config';

// אפשר להגדיר את API_URL על בסיס סביבת Vite וליפול ל-localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const aiService = {
  async chat(messages: any[], model: string) {
    const token = localStorage.getItem('hypercourt_token');
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ model, messages }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Server error (${response.status}): ${data.error || data.message}`);
    }
    if (!data.choices || data.choices.length === 0) {
      throw new Error('The model returned an empty response.');
    }
    return data.choices[0].message.content;
  },
};
