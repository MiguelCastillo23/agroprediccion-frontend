import React, { useState } from 'react';
import { LogOut, User, Sprout, Menu, X } from 'lucide-react';
import { authService } from '../services/firebase';

const Header = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      onLogout();
    }
  };

  return (
    <header style={{
      background: ' rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo1"
                style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'contain',
                }}/>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'black' }}>
                AGROPREDICCIÓN
              </h1>
              <p className="text-xs" style={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                Sistema de Predicción de Demanda
              </p>
            </div>
          </div>


          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden"
            style={{
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.07)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showMenu ? (
              <X style={{ width: '24px', height: '24px', color: 'black' }} />
            ) : (
              <Menu style={{ width: '24px', height: '24px', color: 'black' }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4" style={{
            background: 'rgba(36, 36, 36, 0.18)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User style={{ width: '20px', height: '20px', color: 'black' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(0, 0, 0, 0.8)',
                  marginBottom: '2px'
                }}>
                  Usuario
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'black',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.email || 'Usuario'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.9)',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                color: 'white',
              }}
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;