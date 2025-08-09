const API_URL = 'http://localhost:5001/api/points';

export const pointsService = {
  async awardPoints(userId: string, amount: number) {
    const token = localStorage.getItem('hypercourt_token');
    const res = await fetch(`${API_URL}/award`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId, amount })
    });
    const data = await res.json();
    return data.points || 0;
  },

  async getPoints(userId: string) {
    const token = localStorage.getItem('hypercourt_token');
    const res = await fetch(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.points || 0;
  }
};
