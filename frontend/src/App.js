import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import spinner from './assets/spinner.png';

// Corrige ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Ícones personalizados
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Função de busca Nominatim
async function fetchAddresses(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha na requisição');
  return res.json();
}

// Zoom animado
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.25 });
    }
  }, [position, map]);
  return null;
}

// Roteamento
function Routing({ origin, destination }) {
  const map = useMap();
  const routeLayerRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    const start = `${origin[1]},${origin[0]}`;
    const end = `${destination[1]},${destination[0]}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (!data.routes || !data.routes.length) return;
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        routeLayerRef.current = L.polyline(coords, { color: '#38b6ff', weight: 4 }).addTo(map);
        map.fitBounds(routeLayerRef.current.getBounds(), { padding: [40, 40] });
      })
      .catch(err => console.error('OSRM route error', err));
    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }
    };
  }, [origin, destination, map]);
  return null;
}

export default function App() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [sugsOrigem, setSugsOrigem] = useState([]);
  const [sugsDestino, setSugsDestino] = useState([]);
  const [coordOrigem, setCoordOrigem] = useState(null);
  const [coordDestino, setCoordDestino] = useState(null);
  const [precoKm, setPrecoKm] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [showSugOrigem, setShowSugOrigem] = useState(false);
  const [showSugDestino, setShowSugDestino] = useState(false);

  const origemRef = useRef();
  const destinoRef = useRef();

  // Debounce Origem
  useEffect(() => {
    if (origem.length < 3) { setSugsOrigem([]); setShowSugOrigem(false); return; }
    setLoadingBusca(true);
    setShowSugOrigem(true);
    const tm = setTimeout(async () => {
      try {
        const results = await fetchAddresses(origem);
        const filtered = results.filter(r => r.address?.road && (r.address.city || r.address.town || r.address.village));
        setSugsOrigem(filtered.slice(0, 6));
        setShowSugOrigem(true);
      } catch {
        setMensagem('❌ Erro ao buscar Origem');
      } finally { setLoadingBusca(false); }
    }, 320);
    return () => clearTimeout(tm);
  }, [origem]);

  // Debounce Destino
  useEffect(() => {
    if (destino.length < 3) { setSugsDestino([]); setShowSugDestino(false); return; }
    setLoadingBusca(true);
    setShowSugDestino(true);
    const tm = setTimeout(async () => {
      try {
        const results = await fetchAddresses(destino);
        const filtered = results.filter(r => r.address?.road && (r.address.city || r.address.town || r.address.village));
        setSugsDestino(filtered.slice(0, 6));
        setShowSugDestino(true);
      } catch {
        setMensagem('❌ Erro ao buscar Destino');
      } finally { setLoadingBusca(false); }
    }, 320);
    return () => clearTimeout(tm);
  }, [destino]);

  // Seleciona sugestão (fecha sugestão com fade)
  const pick = (item, tipo) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const street = item.address.road;
    const number = item.address.house_number || '';
    const city = item.address.city || item.address.town || item.address.village;
    const label = number ? `${street}, ${number} – ${city}` : `${street} – ${city}`;
    if (tipo === 'origem') {
      setOrigem(label);
      setCoordOrigem([lat, lon]);
      setSugsOrigem([]);
      setShowSugOrigem(false);
      setTimeout(() => destinoRef.current && destinoRef.current.focus(), 450);
    } else {
      setDestino(label);
      setCoordDestino([lat, lon]);
      setSugsDestino([]);
      setShowSugDestino(false);
    }
  };

  // Fecha popup do marker
  const handleClosePopup = tipo => {
    if (tipo === 'origem') {
      setOrigem('');
      setCoordOrigem(null);
      setMensagem('');
    }
    if (tipo === 'destino') {
      setDestino('');
      setCoordDestino(null);
      setMensagem('');
    }
  };

  // Envia cotação
  const handleSubmit = async () => {
    setLoading(true);
    setMensagem('🚀 Enviando cotação...');
    try {
      const resp = await fetch('http://127.0.0.1:8000/api/cotacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origem, destino, preco_km: precoKm }),
      });
      let data = null;
      try { data = await resp.json(); } catch (e) { data = null; }
      if (!resp.ok) {
        if (data && data.errors) {
          const allErrors = Object.values(data.errors).flat().join(' ');
          setMensagem('❌ ' + allErrors);
        } else if (data && data.message) {
          setMensagem('❌ ' + data.message);
        } else {
          setMensagem('❌ Erro desconhecido. Verifique o backend.');
        }
        return;
      }
      setMensagem(`✅ Cotação salva! ID: ${data.id || 'OK'}`);
    } catch (err) {
      setMensagem('❌ Erro de conexão com a API. O backend está rodando?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {(loading || loadingBusca) && (
        <div className="spinner-overlay">
          <img src={spinner} alt="Carregando..." className="spinner-img" />
          <span className="spinner-text">Buscando informações...</span>
        </div>
      )}
      <MapContainer center={coordOrigem || [-21.37583, -46.52583]} zoom={13} className="map">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {coordOrigem && (
          <Marker position={coordOrigem} icon={greenIcon}>
            <Popup closeButton={true} onClose={() => handleClosePopup('origem')}>
              {origem}
            </Popup>
            <FlyToLocation position={coordOrigem} />
          </Marker>
        )}
        {coordDestino && (
          <Marker position={coordDestino} icon={redIcon}>
            <Popup closeButton={true} onClose={() => handleClosePopup('destino')}>
              {destino}
            </Popup>
            <FlyToLocation position={coordDestino} />
          </Marker>
        )}
        {coordOrigem && coordDestino && <Routing origin={coordOrigem} destination={coordDestino}/>}
      </MapContainer>

      <div className="search-panel search-panel-blue">
        <h3 style={{marginTop:0}}>Cotação</h3>
        <div className="field">
          <label>Origem</label>
          <input
            value={origem}
            onChange={e=>setOrigem(e.target.value)}
            placeholder="Rua, nº, cidade"
            autoFocus
            ref={origemRef}
            style={{border: origem ? '2px solid #38b6ff' : undefined}}
          />
          <ul className={`suggestions suggestions-anim ${showSugOrigem && sugsOrigem.length > 0 ? 'show' : ''}`}>
            {sugsOrigem.map(item=>
              <li key={item.place_id} onClick={()=>pick(item,'origem')}>
                {item.address.road}
                {item.address.house_number ? `, ${item.address.house_number}` : ''}
                {' – '}
                {item.address.city||item.address.town||item.address.village}
              </li>
            )}
          </ul>
        </div>
        <div className="field">
          <label>Destino</label>
          <input
            value={destino}
            onChange={e=>setDestino(e.target.value)}
            placeholder="Rua, nº, cidade"
            disabled={!origem}
            ref={destinoRef}
            style={{border: destino ? '2px solid #38b6ff' : undefined, background: !origem ? '#c9e9fb' : undefined}}
          />
          <ul className={`suggestions suggestions-anim ${showSugDestino && sugsDestino.length > 0 ? 'show' : ''}`}>
            {sugsDestino.map(item=>
              <li key={item.place_id} onClick={()=>pick(item,'destino')}>
                {item.address.road}
                {item.address.house_number ? `, ${item.address.house_number}` : ''}
                {' – '}
                {item.address.city||item.address.town||item.address.village}
              </li>
            )}
          </ul>
        </div>
        <div className="field">
          <label>Preço por Km</label>
          <input type="number" step="0.01" value={precoKm} onChange={e=>setPrecoKm(e.target.value)} placeholder="2.50"/>
        </div>
        <button onClick={handleSubmit} disabled={!(coordOrigem&&coordDestino&&precoKm)}>Enviar Cotação</button>
        {mensagem && <p className="message">{mensagem}</p>}
      </div>
    </div>
  );
}
