// ============================================================
//  API Configuration — change this to your Railway backend URL
// ============================================================
const BASE_URL = 'https://student-market-place-documentation-production.up.railway.app';

const API = {
  async request(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Request failed');
    return data;
  },

  // Auth
  register: (name, email, password) =>
    API.request('/register', 'POST', { name, email, password }),

  login: (email, password) =>
    API.request('/login', 'POST', { email, password }),

  getProfile: (token) =>
    API.request('/users/profile', 'GET', null, token),

  // Products
  getProducts: (skip = 0, limit = 20) =>
    API.request(`/products?skip=${skip}&limit=${limit}`),

  getProduct: (id) =>
    API.request(`/products/${id}`),

  searchProducts: (keyword) =>
    API.request(`/products/search?keyword=${encodeURIComponent(keyword)}`),

  filterProducts: (category, status = 'available') =>
    API.request(`/products/filter?category=${encodeURIComponent(category)}&status=${status}`),

  createProduct: (data, token) =>
    API.request('/products', 'POST', data, token),

  updateProduct: (id, data, token) =>
    API.request(`/products/${id}`, 'PUT', data, token),

  deleteProduct: (id, token) =>
    API.request(`/products/${id}`, 'DELETE', null, token),
};
