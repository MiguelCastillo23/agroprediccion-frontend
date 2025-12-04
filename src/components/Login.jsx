import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, Sprout, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/firebase';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      let result;
      
      if (isLogin) {
        result = await authService.login(email, password);
      } else {
        result = await authService.register(email, password);
      }

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/fondo.jpg)' }}>
      <div className="w-full" style={{ maxWidth: '440px' }}>

        <div style={{
          background: 'rgba(255, 255, 255, 1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '30px 40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>

          <div className="text-center mb-4">
            <img src="/logo.png" alt="Logo" className="mb-1" 
                style={{width: '100px', height: '100px',objectFit: 'contain',}}/>
            <h1 className="text-3xl font-bold mb-2 text-black">
            AGROPREDICCIÓN
            </h1>
            <p className="text-gray-600 text-sm">
              Sistema de Predicción de Demanda Agrícola
            </p>
          </div>


          {error && (
            <div className="mb-6" 
                 style={{
                   padding: '16px',
                   background: 'rgba(254, 242, 242, 0.9)',
                   border: '1px solid #fecaca',
                   borderRadius: '12px',
                   display: 'flex',
                   alignItems: 'flex-start',
                   gap: '12px'
                 }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#991b1b', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-5">
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Correo Electrónico
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Mail style={{
                  position: 'absolute',
                  left: '16px',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af',
                  pointerEvents: 'none'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backgroundColor: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Contraseña
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock style={{
                  position: 'absolute',
                  left: '16px',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af',
                  pointerEvents: 'none'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backgroundColor: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    padding: '4px',
                    border: 'none',
                    background: 'transparent',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  ) : (
                    <Eye style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: loading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                color: 'white',
                boxShadow: loading 
                  ? 'none' 
                  : '0 10px 25px rgba(34, 197, 94, 0.4)',
                transform: loading ? 'scale(1)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(34, 197, 94, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(34, 197, 94, 0.4)';
                }
              }}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin" style={{ fontSize: '20px' }}>⏳</span>
                  Procesando...
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn style={{ width: '20px', height: '20px' }} />
                      Iniciar Sesión
                    </>
                  ) : (
                    <>
                      <UserPlus style={{ width: '20px', height: '20px' }} />
                      Crear Cuenta
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Toggle entre modos */}
          <div className="mt-8 text-center">
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={toggleMode}
                disabled={loading}
                style={{
                  marginLeft: '8px',
                  marginTop: '20px',
                  color: '#16a34a',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '13px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            © 2025 AgroPredicción - Sistema de Predicción de Demanda
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;