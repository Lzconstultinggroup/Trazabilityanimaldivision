import React from 'react';

const CameraList = ({ cameras, onDelete, onView }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>📋 Cámaras Registradas</h3>
      {cameras.length === 0 ? (
        <p>No hay cámaras guardadas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cameras.map((cam) => (
            <li
              key={cam._id}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <strong>{cam.name}</strong> — IP: {cam.ip}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onView(cam)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  👁️ Ver
                </button>

                <button
                  onClick={() => onDelete(cam._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CameraList;
