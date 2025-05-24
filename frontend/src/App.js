import React, { useState } from 'react';

function App() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [preco_km, setPrecoKm] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Enviando...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cotacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origem, destino, preco_km }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensagem(`Cotação salva! ID: ${data.id || 'OK'}`);
      } else {
        setMensagem('Erro ao salvar cotação');
      }
    } catch (error) {
      setMensagem('Erro de conexão com o backend');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 32, background: '#222', color: '#fff', borderRadius: 12 }}>
      <h2>Cotar Frete</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Origem:</label><br />
          <input value={origem} onChange={e => setOrigem(e.target.value)} required />
        </div>
        <div>
          <label>Destino:</label><br />
          <input value={destino} onChange={e => setDestino(e.target.value)} required />
        </div>
        <div>
          <label>Preço por Km:</label><br />
          <input type="number" step="0.01" value={preco_km} onChange={e => setPrecoKm(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: 12 }}>Enviar Cotação</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default App;
