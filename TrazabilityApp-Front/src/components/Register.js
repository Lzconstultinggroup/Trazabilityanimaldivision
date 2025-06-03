// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/register.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('dni', dni);
    formData.append('phoneNumber', phoneNumber);
    if (photo) {
      formData.append('photo', photo);
    }
    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('role', role);

    try {
      const response = await api.post('/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Opcional: podrías guardar la info del usuario aquí, o redirigir al login
      navigate('/login');
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al registrar el usuario. Verifica los datos e intenta nuevamente.');
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="fullName">Nombre Completo</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dni">Número de DNI</label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresa tu DNI"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Número de Celular</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ingresa tu celular"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Foto de Perfil</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Elige un nombre de usuario"
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="operator">Operador</option>
            <option value="professional">Profesional</option>
            <option value="admin">Administrador</option>
            <option value="operador-termico">Operador Térmico</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
      <p className="redirect">
        ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')}>Inicia sesión</span>
      </p>
    </div>
  );
};

export default Register;
