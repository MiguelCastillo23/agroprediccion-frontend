import React from 'react';
import { Table, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PredictionTable = ({ predictions, confidence, productName }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600">No hay predicciones disponibles</p>
        </div>
      </div>
    );
  }

  const getConfidenceBadge = () => {
    if (!confidence) return null;
    
    const colors = {
      'Alta': 'bg-green-100 text-green-800',
      'Media': 'bg-yellow-100 text-yellow-800',
      'Baja': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[confidence.level]}`}>
        Confianza {confidence.level}: {confidence.score}%
      </span>
    );
  };

  const getTrendIcon = (current, previous) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
    
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return <Minus className="w-4 h-4 text-gray-400" />;
    
    return diff > 0 
      ? <TrendingUp className="w-4 h-4 text-green-600" />
      : <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const formatChange = (current, previous) => {
    if (!previous) return '-';
    
    const diff = current - previous;
    const percentChange = ((diff / previous) * 100).toFixed(1);
    
    if (Math.abs(diff) < 0.1) return '0%';
    
    const color = diff > 0 ? 'text-green-600' : 'text-red-600';
    const sign = diff > 0 ? '+' : '';
    
    return (
      <span className={color}>
        {sign}{percentChange}%
      </span>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Table className="w-5 h-5 text-primary-600" />
          Tabla de Predicciones - {productName}
        </h3>
        {getConfidenceBadge()}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Período
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Predicción (TN)
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Tendencia
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Cambio
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Rango Confianza
              </th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((pred, index) => (
              <tr 
                key={pred.fecha} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {pred.fecha}
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-primary-600">
                  {pred.prediccion.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {getTrendIcon(
                    pred.prediccion, 
                    index > 0 ? predictions[index - 1].prediccion : null
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold">
                  {formatChange(
                    pred.prediccion, 
                    index > 0 ? predictions[index - 1].prediccion : null
                  )}
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-600">
                  {pred.limite_inferior.toFixed(2)} - {pred.limite_superior.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="px-4 py-3 text-sm font-bold text-gray-700">
                Promedio Predicho
              </td>
              <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                {(predictions.reduce((sum, p) => sum + p.prediccion, 0) / predictions.length).toFixed(2)}
              </td>
              <td colSpan="3" className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default PredictionTable;