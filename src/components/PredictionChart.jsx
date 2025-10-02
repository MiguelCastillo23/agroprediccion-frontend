import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

const PredictionChart = ({ historicalData, predictions, productName }) => {
  if (!historicalData || !predictions) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-gray-500">No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  // Combinar datos históricos y predicciones
  const chartData = [
    // Datos históricos
    ...historicalData.map(item => ({
      fecha: item.fecha,
      demanda: item.demanda,
      tipo: 'Histórico'
    })),
    // Punto de conexión: último valor histórico como inicio de predicción
    {
      fecha: historicalData[historicalData.length - 1].fecha,
      demanda: historicalData[historicalData.length - 1].demanda,
      prediccion: historicalData[historicalData.length - 1].demanda,
      limite_inferior: historicalData[historicalData.length - 1].demanda,
      limite_superior: historicalData[historicalData.length - 1].demanda,
      tipo: 'Conexión'
    },
    // Predicciones futuras
    ...predictions.map(item => ({
      fecha: item.fecha,
      prediccion: item.prediccion,
      limite_inferior: item.limite_inferior,
      limite_superior: item.limite_superior,
      tipo: 'Predicción'
    }))
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{data.fecha}</p>
          
          {data.demanda !== undefined && (
            <p className="text-sm text-blue-600">
              Demanda Real: <strong>{data.demanda.toFixed(2)} TN</strong>
            </p>
          )}
          
          {data.prediccion !== undefined && (
            <>
              <p className="text-sm text-green-600">
                Predicción: <strong>{data.prediccion.toFixed(2)} TN</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rango: {data.limite_inferior.toFixed(2)} - {data.limite_superior.toFixed(2)} TN
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-600" />
        Predicción de Demanda - {productName}
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="fecha" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Demanda (TN)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '20px' }}
          />
          
          {/* Área de confianza para predicciones */}
          <Area
            type="monotone"
            dataKey="limite_superior"
            stackId="1"
            stroke="none"
            fill="#86efac"
            fillOpacity={0.3}
            name="Límite Superior"
          />
          <Area
            type="monotone"
            dataKey="limite_inferior"
            stackId="1"
            stroke="none"
            fill="#86efac"
            fillOpacity={0.3}
            name="Límite Inferior"
          />
          
          {/* Línea de demanda histórica */}
          <Line
            type="monotone"
            dataKey="demanda"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6' }}
            name="Demanda Real"
            connectNulls
          />
          
          {/* Línea de predicción */}
          <Line
            type="monotone"
            dataKey="prediccion"
            stroke="#22c55e"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 5, fill: '#22c55e' }}
            name="Predicción"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-semibold mb-1">Datos Históricos</p>
          <p className="text-2xl font-bold text-blue-900">{historicalData.length}</p>
          <p className="text-xs text-blue-600">meses registrados</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-semibold mb-1">Predicciones</p>
          <p className="text-2xl font-bold text-green-900">{predictions.length}</p>
          <p className="text-xs text-green-600">meses proyectados</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-semibold mb-1">Última Demanda</p>
          <p className="text-2xl font-bold text-purple-900">
            {historicalData[historicalData.length - 1]?.demanda.toFixed(2)} TN
          </p>
          <p className="text-xs text-purple-600">
            {historicalData[historicalData.length - 1]?.fecha}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;