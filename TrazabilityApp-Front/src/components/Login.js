import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/login.css';
import logo from '../assets/logo.jpeg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Activar animación
      setIsAnimating(true);

      // Esperar a que termine la animación (1.2s)
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Error en login:', err);
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="login-page">
      <img
        src={logo}
        alt="Logo"
        className={`login-page-logo ${isAnimating ? 'expand-logo' : ''}`}
      />
      {!isAnimating && (
        <div className="login-container">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Entrar</button>
          </form>
          <p className="redirect">
            ¿No tienes cuenta? <span onClick={() => navigate('/register')}>Regístrate</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
