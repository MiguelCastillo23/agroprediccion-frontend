export const validateFile = (file) => {
  const validExtensions = ['.xlsx', '.xls', '.txt', '.csv'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  const fileName = file.name.toLowerCase();
  const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!isValidExtension) {
    return {
      valid: false,
      error: 'Formato no válido. Use archivos Excel (.xlsx, .xls) o TXT (.txt, .csv)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es muy grande. Máximo 10MB'
    };
  }
  
  return { valid: true };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (fileName) => {
  const name = fileName.toLowerCase();
  
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return '📊';
  } else if (name.endsWith('.txt') || name.endsWith('.csv')) {
    return '📄';
  }
  
  return '📁';
};