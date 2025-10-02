import React, { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import apiService from '../services/api';

const ProductSelector = ({ onProductSelect, selectedProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await apiService.getProducts();
      setProducts(result.products || []);
      
      if (result.products && result.products.length > 0 && !selectedProduct) {
        onProductSelect(result.products[0]);
      }
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-6 h-6 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchProducts} className="btn-secondary mt-4">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">No hay productos disponibles</p>
          <p className="text-sm text-gray-500">Sube un archivo con datos de demanda primero</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600" />
          Seleccionar Producto
        </h3>
        <button
          onClick={fetchProducts}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar lista"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <button
            key={product}
            onClick={() => onProductSelect(product)}
            className={`p-4 rounded-lg border-2 transition-all font-semibold ${
              selectedProduct == product
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {product}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
        <span className="text-sm text-gray-600">
          <strong>{products.length}</strong> producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
        </span>
        {selectedProduct && (
          <span className="text-sm font-semibold text-primary-600">
            Seleccionado: {selectedProduct}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;