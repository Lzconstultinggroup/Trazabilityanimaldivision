// src/components/MobileNavBar.jsx
import React from 'react';
import { Home, ScanLine, Video, User, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/MobileNavBar.css';

const navItems = [
  { icon: <Home size={22} />, label: 'Inicio', path: '/dashboard' },
  { icon: <ScanLine size={22} />, label: 'Operarios', path: '/create-worker' },
  { icon: <ClipboardList size={22} />, label: 'Historial', path: '/historial/1' }, // ejemplo
  { icon: <Video size={22} />, label: 'Cámaras', path: '/dashboard' }, // temporal
  { icon: <User size={22} />, label: 'Cuenta', path: '/dashboard' } // temporal
];


const MobileNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mobile-nav">
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNavBar;
