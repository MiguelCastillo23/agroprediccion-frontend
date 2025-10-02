import React from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDFReport = ({ productName, historicalData, predictions, confidence }) => {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título del reporte
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text('AGROPREDICCIÓN', pageWidth / 2, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Reporte de Predicción - ${productName}`, pageWidth / 2, 30, { align: 'center' });
    
    // Fecha del reporte
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generado el: ${today}`, pageWidth / 2, 37, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.line(15, 40, pageWidth - 15, 40);
    
    // Información de confianza
    let yPosition = 50;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Nivel de Confianza del Modelo:', 15, yPosition);
    
    const confidenceColor = confidence.level === 'Alta' ? [34, 197, 94] : 
                           confidence.level === 'Media' ? [234, 179, 8] : 
                           [239, 68, 68];
    doc.setTextColor(...confidenceColor);
    doc.setFont(undefined, 'bold');
    doc.text(`${confidence.level} (${confidence.score}%)`, 80, yPosition);
    doc.setFont(undefined, 'normal');
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Datos históricos analizados: ${historicalData.length} meses`, 15, yPosition);
    
    // Tabla de datos históricos (últimos 6 meses)
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Demanda Histórica Reciente:', 15, yPosition);
    
    const recentHistorical = historicalData.slice(-6);
    const historicalTableData = recentHistorical.map(item => [
      item.fecha,
      item.demanda.toFixed(2) + ' TN'
    ]);
    
    autoTable(doc, {
      startY: yPosition + 5,
      head: [['Período', 'Demanda']],
      body: historicalTableData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 }
    });
    
    // Tabla de predicciones
    yPosition = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Predicciones:', 15, yPosition);
    
    const predictionsTableData = predictions.map((pred, index) => {
      const prevPred = index > 0 ? predictions[index - 1].prediccion : null;
      const change = prevPred ? ((pred.prediccion - prevPred) / prevPred * 100).toFixed(1) + '%' : '-';
      
      return [
        pred.fecha,
        pred.prediccion.toFixed(2) + ' TN',
        change,
        `${pred.limite_inferior.toFixed(2)} - ${pred.limite_superior.toFixed(2)} TN`
      ];
    });
    
    autoTable(doc, {
      startY: yPosition + 5,
      head: [['Período', 'Predicción', 'Cambio', 'Rango Confianza']],
      body: predictionsTableData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 }
    });
    
    // Estadísticas finales
    yPosition = doc.lastAutoTable.finalY + 15;
    
    const avgPrediction = (predictions.reduce((sum, p) => sum + p.prediccion, 0) / predictions.length).toFixed(2);
    const lastHistorical = historicalData[historicalData.length - 1].demanda;
    const changeFromLast = ((avgPrediction - lastHistorical) / lastHistorical * 100).toFixed(1);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumen Estadístico:', 15, yPosition);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`• Promedio predicho: ${avgPrediction} TN`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`• Última demanda real: ${lastHistorical.toFixed(2)} TN`, 20, yPosition);
    
    yPosition += 6;
    const changeColor = changeFromLast >= 0 ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(...changeColor);
    doc.text(`• Cambio proyectado: ${changeFromLast}%`, 20, yPosition);
    
    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        'AgroPredicción - Sistema de Predicción de Demanda Agrícola',
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: 'center' }
      );
    }
    
    // Guardar PDF
    const fileName = `Prediccion_${productName}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (!predictions || predictions.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Exportar Reporte
        </h3>
        <p className="text-gray-600 mb-6">
          Descarga un reporte completo en PDF con las predicciones y estadísticas
        </p>
        <button
          onClick={generatePDF}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Descargar Reporte PDF
        </button>
      </div>
    </div>
  );
};

export default PDFReport;