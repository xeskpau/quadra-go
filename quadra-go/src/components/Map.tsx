import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PopupContent = styled.div`
  padding: 0.5rem;
  text-align: center;
`;

const CenterName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1rem;
`;

interface Location {
  lat: number;
  lng: number;
}

interface SportsCenter {
  id: string;
  name: string;
  location: Location;
}

interface MapProps {
  sportsCenters: SportsCenter[];
  selectedCenter?: SportsCenter;
  onCenterChange?: (location: Location) => void;
}

const Map: React.FC<MapProps> = ({
  sportsCenters,
  selectedCenter,
  onCenterChange,
}) => {
  const defaultCenter: Location = {
    lat: 40.7128,
    lng: -74.0060,
  };

  useEffect(() => {
    if (selectedCenter && onCenterChange) {
      onCenterChange(selectedCenter.location);
    }
  }, [selectedCenter, onCenterChange]);

  return (
    <MapWrapper>
      <MapContainer
        center={selectedCenter?.location || defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        data-testid="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {sportsCenters.map((center) => (
          <Marker
            key={center.id}
            position={center.location}
            data-testid="map-marker"
          >
            <Popup>
              <PopupContent>
                <CenterName>{center.name}</CenterName>
              </PopupContent>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default Map; 