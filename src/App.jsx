import React, { useState, useEffect } from 'react';
import { Sprout, AlertCircle } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProductSelector from './components/ProductSelector';
import PredictionChart from './components/PredictionChart';
import PredictionTable from './components/PredictionTable';
import PDFReport from './components/PDFReport';
import apiService from './services/api';
import './index.css';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadStats, setUploadStats] = useState(null);

  // Verificar estado del servidor al cargar
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await apiService.healthCheck();
    } catch (err) {
      setError('No se puede conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }
  };

  // Obtener predicción cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      fetchPrediction(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchPrediction = async (producto) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await apiService.getPrediction(producto, 3);
      setPredictionData(result);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al obtener predicción';
      setError(errorMsg);
      setPredictionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (stats) => {
    setUploadStats(stats);
    setPredictionData(null);
    setSelectedProduct(null);
    
    // Refrescar productos después de 1 segundo
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="w-12 h-12 text-primary-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              AGROPREDICCIÓN
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Sistema de Predicción de Demanda para Productos Agrícolas
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
          </div>
        </header>

        {/* Error del servidor */}
        {error && !selectedProduct && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error de Conexión</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Sección de carga de archivos */}
        <div className="mb-8">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Estadísticas de carga */}
        {uploadStats && (
          <div className="mb-8 card bg-green-50 border-green-200">
            <h3 className="font-bold text-green-900 mb-3">✓ Datos cargados exitosamente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-semibold">Total registros:</span>
                <span className="ml-2 text-green-900">{uploadStats.total_registros}</span>
              </div>
              <div>
                <span className="text-green-700 font-semibold">Productos:</span>
                <span className="ml-2 text-green-900">{uploadStats.num_productos}</span>
              </div>
              <div>
                <span className="text-green-700 font-semibold">Período:</span>
                <span className="ml-2 text-green-900">
                  {uploadStats.rango_fechas?.inicio} - {uploadStats.rango_fechas?.fin}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Selector de productos */}
        <div className="mb-8">
          <ProductSelector 
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Generando predicción...</p>
          </div>
        )}

        {/* Error de predicción */}
        {error && selectedProduct && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-semibold">Error al generar predicción</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados de predicción */}
        {!loading && predictionData && predictionData.success && (
          <div className="space-y-8">
            {/* Gráfico */}
            <PredictionChart
              historicalData={predictionData.historico}
              predictions={predictionData.prediccion}
              productName={predictionData.producto}
            />

            {/* Tabla */}
            <PredictionTable
              predictions={predictionData.prediccion}
              confidence={predictionData.confianza}
              productName={predictionData.producto}
            />

            {/* Botón de descarga PDF */}
            <PDFReport
              productName={predictionData.producto}
              historicalData={predictionData.historico}
              predictions={predictionData.prediccion}
              confidence={predictionData.confianza}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 AgroPredicción - Sistema de Predicción de Demanda</p>
        </footer>
      </div>
    </div>
  );
}

export default App;