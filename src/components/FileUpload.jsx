import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateFile, formatFileSize, getFileIcon } from '../utils/fileParser';
import apiService from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      
      if (!validation.valid) {
        setError(validation.error);
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiService.uploadFile(file);
      
      setSuccess(`✓ ${result.message}`);
      setFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onUploadSuccess) {
        onUploadSuccess(result.stats);
      }
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al subir el archivo';
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      
      setFile(droppedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6 text-primary-600" />
        Subir Datos de Demanda
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          file ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.txt,.csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        
        {!file ? (
          <label htmlFor="file-input" className="cursor-pointer">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Arrastra un archivo o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Formatos aceptados: Excel (.xlsx, .xls) o TXT/CSV
            </p>
            <p className="text-xs text-gray-400">
              El archivo debe contener: PRODUCTO, ANIO, MES, DEMANDA
            </p>
          </label>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">{getFileIcon(file.name)}</span>
            <div className="text-left">
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="ml-4 p-2 hover:bg-red-100 rounded-full transition-colors"
              title="Remover archivo"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="btn-primary w-full mt-6"
      >
        {uploading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 inline mr-2" />
            Subir Archivo
          </>
        )}
      </button>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Formato requerido:</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Columna 1: <strong>PRODUCTO</strong> (ej: PAPA, MAIZ)</p>
          <p>• Columna 2: <strong>ANIO</strong> (ej: 2024)</p>
          <p>• Columna 3: <strong>MES</strong> (ej: 1, 2, 3...12)</p>
          <p>• Columna 4: <strong>DEMANDA</strong> o <strong>DEMANDA (TN)</strong></p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;