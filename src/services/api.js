import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Verificar estado del servidor
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Subir archivo con datos de demanda
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obtener lista de productos
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Obtener predicción para un producto
  getPrediction: async (producto, periods = 3) => {
    const response = await api.get(`/predict/${producto}`, {
      params: { periods }
    });
    return response.data;
  },

  // Obtener predicciones para todos los productos
  getAllPredictions: async (periods = 3) => {
    const response = await api.get('/predict-all', {
      params: { periods }
    });
    return response.data;
  },

  // Obtener datos históricos de un producto
  getProductData: async (producto) => {
    const response = await api.get(`/data/${producto}`);
    return response.data;
  },

  // Limpiar todos los datos
  clearAllData: async () => {
    const response = await api.delete('/clear-data');
    return response.data;
  },
};

export default apiService;