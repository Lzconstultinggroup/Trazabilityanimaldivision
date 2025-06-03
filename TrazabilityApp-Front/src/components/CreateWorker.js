// src/components/CreateWorker.js
import React, { useState } from 'react';
import api from '../api';
import '../styles/register.css';

const CreateWorker = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('dni', dni);
    formData.append('phoneNumber', phoneNumber);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('role', role);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/api/users/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Trabajador creado con éxito ✅');
      // Resetear campos
      setFullName('');
      setEmail('');
      setDni('');
      setPhoneNumber('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setPhoto(null);
    } catch (err) {
      console.error(err);
      setError('Error al crear el trabajador. Verifica los datos.');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear Trabajador</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Nombre completo</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="operator">Operario</option>
            <option value="professional">Profesional</option>
            <option value="thermal_operator">Operador Térmico</option>
          </select>

        </div>
        <div className="form-group">
          <label>Foto</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} required />
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="success" style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Crear Trabajador</button>
      </form>
    </div>
  );
};

export default CreateWorker;
