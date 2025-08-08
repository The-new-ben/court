import type { ChatMessage } from '../../types';

const API_URL = 'http://localhost:5001/api';

export const aiService = {
  async chat(messages: ChatMessage[], model: string) {
    const token = localStorage.getItem('hypercourt_token');
    
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ model, messages })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`שגיאת שרת (${response.status}): ${data.error || data.message}`);
    }
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("המודל החזיר תשובה ריקה.");
    }
    
    return data.choices[0].message.content;
  }
};