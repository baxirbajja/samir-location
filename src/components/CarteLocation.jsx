import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const CarteLocation = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const casablancaPosition = [33.5731, -7.5898]; // Coordonnées de Casablanca

  useEffect(() => {
    if (position) {
      // Reverse geocoding using Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
        .then(response => response.json())
        .then(data => {
          setAddress(data.display_name);
          onLocationSelect({
            lat: position.lat,
            lng: position.lng,
            address: data.display_name
          });
        })
        .catch(error => {
          console.error('Erreur lors de la récupération de l\'adresse:', error);
        });
    }
  }, [position, onLocationSelect]);

  return (
    <div className="carte-container">
      <div style={{ height: '400px', width: '100%', marginBottom: '1rem' }}>
        <MapContainer
          center={casablancaPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      {address && (
        <div className="alert alert-info">
          <strong>Adresse sélectionnée:</strong><br />
          {address}
        </div>
      )}
      <p className="text-muted">
        Cliquez sur la carte pour sélectionner l'emplacement de votre location
      </p>
    </div>
  );
};

export default CarteLocation;
