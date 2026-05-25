const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moderate-backend.onrender.com';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  combos: `${API_BASE_URL}/api/combos`,
  admin: {
    login: `${API_BASE_URL}/api/admin/login`,
    verify: `${API_BASE_URL}/api/admin/verify`,
    products: `${API_BASE_URL}/api/admin/products`,
    combos: `${API_BASE_URL}/api/admin/combos`,
    changePassword: `${API_BASE_URL}/api/admin/change-password`,
    changeEmail: `${API_BASE_URL}/api/admin/change-email`
  }
};

export const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export default API_BASE_URL;
