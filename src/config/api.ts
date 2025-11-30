export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const GOOGLE_CLIENT_ID = '210580432582-44ba111lb7r9b1eutii1f4514h1b68rq.apps.googleusercontent.com';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
