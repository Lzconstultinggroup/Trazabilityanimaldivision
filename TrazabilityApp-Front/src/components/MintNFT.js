// src/components/MintNFT.js
import React, { useState } from 'react';
import axios from 'axios';

const MintNFT = () => {
  const [uid, setUid] = useState('');
  const [eventIndex, setEventIndex] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:3000/api/nft/mint',
        { uid, eventIndex: parseInt(eventIndex, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('NFT minteado: ' + JSON.stringify(res.data.nft));
    } catch (error) {
      alert('Error al mintear NFT');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Mintear NFT</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="UID del Animal" value={uid} onChange={e => setUid(e.target.value)} />
        <br />
        <input placeholder="Índice de Evento" value={eventIndex} onChange={e => setEventIndex(e.target.value)} />
        <br />
        <button type="submit">Mintear NFT</button>
      </form>
    </div>
  );
};

export default MintNFT;
