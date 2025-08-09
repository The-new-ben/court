const API_URL = 'http://localhost:5001/api/admin';

export const adminService = {
  async getUsers() {
    const token = localStorage.getItem('hypercourt_token');
    const res = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error('שגיאה בטעינת משתמשים');
    }
    return res.json();
  },

  async updateUserRole(id: string, role: string) {
    const token = localStorage.getItem('hypercourt_token');
    const res = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      throw new Error('שגיאה בעדכון תפקיד');
    }
    return res.json();
  }
};
