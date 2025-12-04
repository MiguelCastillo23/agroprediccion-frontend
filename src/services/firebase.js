import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// REEMPLAZA CON TU CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAJC7uU9o4UEug_Eikm66767WGmWffZX64",
  authDomain: "agroprediccion.firebaseapp.com",
  projectId: "agroprediccion",
  storageBucket: "agroprediccion.firebasestorage.app",
  messagingSenderId: "1078256578245",
  appId: "1:1078256578245:web:79c85372ae40654d274aac",
  measurementId: "G-1CTXCVDN28"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funciones de autenticación
export const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  },

  // Registrar nuevo usuario
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Observador de estado de autenticación
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return auth.currentUser;
  }
};

// Mensajes de error en español
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/invalid-credential': 'Credenciales inválidas'
  };

  return errorMessages[errorCode] || 'Error al autenticar. Intenta nuevamente';
};

export default auth;