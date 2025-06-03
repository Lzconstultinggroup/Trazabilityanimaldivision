import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/ChipHistory.css';

const ChipHistory = () => {
  const { uid } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // ✅ Asegurarse que se use el token
        const response = await api.get(`/api/nft/history/${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data);
      } catch (err) {
        console.error('Error al obtener historial:', err);
      }
    };

    fetchData();
  }, [uid]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Historial del chip: ${uid}`, 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [['Fecha', 'Evento', 'Descripción', 'Rol', 'Usuario']],
      body: history.map(item => [
        new Date(item.timestamp).toLocaleString(),
        item.eventType,
        item.description || '—',
        item.role,
        item.createdBy?.username || '—',
      ]),
    });

    doc.save(`Historial_${uid}.pdf`);
  };

  return (
    <div className="chip-history-container">
      <h2>Historial del Chip: {uid}</h2>
      <button className="pdf-btn" onClick={exportToPDF}>Exportar PDF</button>
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index}>
            <strong>{item.eventType}</strong> — {item.description || 'Sin descripción'}  
            <br />
            <small>{new Date(item.timestamp).toLocaleString()} — <b>{item.role}</b></small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChipHistory;
