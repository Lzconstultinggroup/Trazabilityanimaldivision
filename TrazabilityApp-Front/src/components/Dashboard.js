import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NFCReader from './NFCReader';
import CreateWorker from './CreateWorker';
import MyWorkers from './MyWorkers';
import MyChips from './MyChips';
import RegisterChip from './RegisterChip';
import MassScan from './MassScan';
import CameraSetup from './Camera/CameraSetup';
import CameraManager from './CameraManager';
import ThermalOperatorView from './ThermalOperatorView';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import '../styles/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [nfcData, setNfcData] = useState(null);
  const [mintResponse, setMintResponse] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [scansCount, setScansCount] = useState(0);
  const [workersActiveCount, setWorkersActiveCount] = useState(0);
  const [adminCams, setAdminCams] = useState([]);
  const [showSetup, setShowSetup] = useState(false);
  const [userName, setUserName] = useState('Usuario');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [adminId, setAdminId] = useState('');

  const chartData = {
    labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
    datasets: [
      {
        label: 'Escaneos por hora',
        data: [5, 15, 30, 25, 10],
        backgroundColor: 'rgba(45, 137, 239, 0.5)',
        borderColor: '#2D89EF',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Mayor hora de actividad',
      }
    },
    scales: {
      x: { type: 'category' },
      y: { type: 'linear' }
    }
  };

  useEffect(() => {
    const fetchScansAndWorkers = () => {
      setScansCount(prev => prev + Math.floor(Math.random() * 5));
      setWorkersActiveCount(prev => prev + Math.floor(Math.random() * 2));
    };
    fetchScansAndWorkers();
    const interval = setInterval(fetchScansAndWorkers, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.fullName || 'Usuario');
        setUserRole(userObj.role || '');
        setAdminId(userObj._id);
        if (userObj.photo && !userObj.photo.startsWith('http')) {
          setUserPhoto(process.env.REACT_APP_API_URL + '/' + userObj.photo);
        } else {
          setUserPhoto(userObj.photo);
        }
      } catch (e) {
        console.error('Error parseando el usuario:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNFCData = (data) => {
    setNfcData(data);
    setMintResponse(null);
  };

  const fetchAdminCameras = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/cameras/my', {
        headers: { 'x-admin-id': adminId }
      });
      const data = await res.json();
      setAdminCams(data);
    } catch (err) {
      console.error('Error cargando cámaras del admin', err);
    }
  };

  useEffect(() => {
    if (currentTab === 'cameras' && userRole === 'admin' && adminId) {
      fetchAdminCameras();
    }
  }, [currentTab, userRole, adminId]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-pic">
            <img src={userPhoto} alt="Perfil" />
          </div>
          <h3 className="profile-name">{userName}</h3>
          <p className="profile-role">Rol: {userRole}</p>
        </div>
        <nav className="menu">
          <ul>
            <li className={currentTab === 'home' ? 'active' : ''} onClick={() => setCurrentTab('home')}>Dashboard</li>
            {userRole === 'admin' && (
              <>
                <li className={currentTab === 'create-worker' ? 'active' : ''} onClick={() => setCurrentTab('create-worker')}>Crear Trabajador</li>
                <li className={currentTab === 'my-workers' ? 'active' : ''} onClick={() => setCurrentTab('my-workers')}>Ver Trabajadores</li>
                <li className={currentTab === 'my-chips' ? 'active' : ''} onClick={() => setCurrentTab('my-chips')}>Ver Chips</li>
                <li className={currentTab === 'register-chip' ? 'active' : ''} onClick={() => setCurrentTab('register-chip')}>Registrar Chip</li>
                <li className={currentTab === 'cameras' ? 'active' : ''} onClick={() => setCurrentTab('cameras')}>Cámaras</li>
              </>
            )}
            {userRole === 'operator' && (
              <li className={currentTab === 'mass-scan' ? 'active' : ''} onClick={() => setCurrentTab('mass-scan')}>Escaneo Masivo</li>
            )}
            {userRole === 'thermal-operator' && (
              <li className={currentTab === 'thermal-view' ? 'active' : ''} onClick={() => setCurrentTab('thermal-view')}>Vista Térmica</li>
            )}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-container">
            <input type="text" placeholder="Buscar..." />
          </div>
          <div className="top-bar-icons">
            <span className="icon">🔔</span>
            <span className="icon">💌</span>
            <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </header>

        {currentTab === 'home' && (
          <>
            <section className="welcome-section">
              <h2>Hola, {userName}</h2>
            </section>
            <section className="stats-section">
              <div className="card">
                <h3>Escaneos</h3>
                <p>{scansCount} escaneos realizados hoy</p>
              </div>
              <div className="card">
                <h3>Trabajadores Activos</h3>
                <p>{workersActiveCount} trabajadores activos hoy</p>
              </div>
              <div className="card">
                <h3>Mayor Hora de Actividad</h3>
                <div className="placeholder">[Gráfico de Actividad]</div>
              </div>
            </section>
            <section className="stats-section">
              <div className="card">
                <h3>Escaneos por Hora</h3>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </section>
          </>
        )}

        {currentTab === 'cameras' && userRole === 'admin' && (
          <>
            <CameraManager cameras={adminCams} onRefresh={fetchAdminCameras} />
            <button style={{ marginTop: 20 }} onClick={() => setShowSetup(true)}>
              ➕ Añadir nueva cámara
            </button>
            {showSetup && (
              <CameraSetup onSaved={() => {
                fetchAdminCameras();
                setShowSetup(false);
              }} />
            )}
          </>
        )}

        {currentTab === 'thermal-view' && userRole === 'thermal-operator' && (
          <ThermalOperatorView />
        )}

        {currentTab === 'create-worker' && userRole === 'admin' && <CreateWorker />}
        {currentTab === 'my-workers' && userRole === 'admin' && <MyWorkers />}
        {currentTab === 'my-chips' && userRole === 'admin' && <MyChips />}
        {currentTab === 'register-chip' && userRole === 'admin' && <RegisterChip />}
        {currentTab === 'mass-scan' && userRole === 'operator' && <MassScan />}
      </main>
    </div>
  );
};

export default Dashboard;
