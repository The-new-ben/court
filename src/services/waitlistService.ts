export const waitlistService = {
  async join(email: string) {
    const res = await fetch('/api/lobby/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      throw new Error('Failed to join waitlist');
    }
    return res.json();
  },
};
