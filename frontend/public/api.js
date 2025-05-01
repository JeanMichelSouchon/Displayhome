const axios = require('axios');

// Création d'une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: 'https://backend-service-387352143812.europe-west9.run.app/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter le token JWT à chaque requête
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers['Authorization'] = `Bearer ${token}`;
//     } else {
//         window.location.href = 'index.html';
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

module.exports = api;