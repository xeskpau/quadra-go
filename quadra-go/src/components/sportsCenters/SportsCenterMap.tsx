import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components';
import { SportsCenter } from '../../utils/mockData';

const MapWrapper = styled.div`
  height: 600px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PopupContent = styled.div`
  padding: 5px;
`;

const PopupTitle = styled.h4`
  margin: 0 0 5px;
  color: var(--primary-color);
`;

const PopupAddress = styled.p`
  margin: 0 0 5px;
  font-size: 12px;
  color: var(--dark-gray);
`;

const PopupButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 5px;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

interface SportsCenterMapProps {
  sportsCenters: SportsCenter[];
  onSelectSportsCenter: (id: string) => void;
}

const SportsCenterMap: React.FC<SportsCenterMapProps> = ({ sportsCenters, onSelectSportsCenter }) => {
  // Calculate center of the map based on all sports centers
  const calculateCenter = () => {
    if (sportsCenters.length === 0) {
      return [34.0522, -118.2437]; // Default to Los Angeles
    }
    
    const sumLat = sportsCenters.reduce((sum, center) => sum + center.location.lat, 0);
    const sumLng = sportsCenters.reduce((sum, center) => sum + center.location.lng, 0);
    
    return [sumLat / sportsCenters.length, sumLng / sportsCenters.length];
  };
  
  const center: [number, number] = calculateCenter() as [number, number];
  
  return (
    <MapWrapper>
      <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {sportsCenters.map((center) => (
          <Marker 
            key={center.id} 
            position={[center.location.lat, center.location.lng]}
          >
            <Popup>
              <PopupContent>
                <PopupTitle>{center.name}</PopupTitle>
                <PopupAddress>{center.address}, {center.city}</PopupAddress>
                <PopupButton onClick={() => onSelectSportsCenter(center.id)}>
                  View Details
                </PopupButton>
              </PopupContent>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default SportsCenterMap; 