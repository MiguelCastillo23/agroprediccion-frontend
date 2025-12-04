import React, { useState, useEffect } from 'react';
import { Sprout, AlertCircle } from 'lucide-react';
import Login from './components/Login';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProductSelector from './components/ProductSelector';
import PredictionChart from './components/PredictionChart';
import PredictionTable from './components/PredictionTable';
import PDFReport from './components/PDFReport';
import apiService from './services/api';
import { authService } from './services/firebase';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadStats, setUploadStats] = useState(null);

  // Verificar si hay usuario autenticado al cargar
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Verificar estado del servidor al iniciar sesión
  useEffect(() => {
    if (user) {
      checkServerHealth();
    }
  }, [user]);

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
    setPredictionLoading(true);
    setError('');
    
    try {
      const result = await apiService.getPrediction(producto, 3);
      setPredictionData(result);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al obtener predicción';
      setError(errorMsg);
      setPredictionData(null);
    } finally {
      setPredictionLoading(false);
    }
  };

  const handleUploadSuccess = (stats) => {
    setUploadStats(stats);
    setPredictionData(null);
    setSelectedProduct(null);
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedProduct(null);
    setPredictionData(null);
    setUploadStats(null);
  };

  // Mostrar loading inicial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar login si no hay usuario
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error del servidor */}
        {error && !selectedProduct && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" style={{ width: '20px', height: '20px', marginTop: '2px' }} />
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
            <div className="grid grid-cols-1 gap-4 text-sm" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
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
        {predictionLoading && (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Generando predicción...</p>
          </div>
        )}

        {/* Error de predicción */}
        {error && selectedProduct && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" style={{ width: '20px', height: '20px', marginTop: '2px' }} />
              <div>
                <p className="text-red-700 font-semibold">Error al generar predicción</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados de predicción */}
        {!predictionLoading && predictionData && predictionData.success && (
          <div className="space-y-8">
            <PredictionChart
              historicalData={predictionData.historico}
              predictions={predictionData.prediccion}
              productName={predictionData.producto}
            />

            <PredictionTable
              predictions={predictionData.prediccion}
              confidence={predictionData.confianza}
              productName={predictionData.producto}
            />

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
          <p>© 2025 AgroPredicción - Sistema de Predicción de Demanda</p>
          {/* <p className="mt-2">Desarrollado con React + Flask + Prophet ML</p> */}
        </footer>
      </div>
    </div>
  );
}

export default App;