const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const MessageService = {
  getRoomMessages: async (roomId, token) => {
    const response = await fetch(`${API_URL}/messages/room/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return await response.json();
  },

  getPrivateMessages: async (userId, token) => {
    const response = await fetch(`${API_URL}/messages/private/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch private messages');
    }

    return await response.json();
  },

  deleteMessage: async (messageId, token) => {
    const response = await fetch(`${API_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete message');
    }

    return await response.json();
  }
};