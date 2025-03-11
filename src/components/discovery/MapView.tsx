import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import styled from 'styled-components';
import { SportsCenter } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
// Use string paths instead of direct imports
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
const retinaIconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';

// Fix Leaflet's default icon path issues
const DefaultIcon = new Icon({
  iconUrl,
  shadowUrl,
  iconRetinaUrl: retinaIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Styled components
const MapWrapper = styled.div`
  height: 600px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const PopupContent = styled.div`
  padding: 0.5rem;
  max-width: 250px;
`;

const PopupTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
`;

const PopupAddress = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #718096;
`;

const PopupInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
`;

const PopupPrice = styled.span`
  font-weight: 600;
  color: #3182ce;
`;

const PopupDistance = styled.span`
  color: #718096;
`;

const PopupSports = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const SportTag = styled.span`
  background-color: #ebf8ff;
  color: #3182ce;
  padding: 0.2rem 0.4rem;
  border-radius: 20px;
  font-size: 0.75rem;
`;

// Component to recenter map when user location changes
interface RecenterMapProps {
  position: LatLngExpression;
}

const RecenterMap: React.FC<RecenterMapProps> = ({ position }) => {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
};

interface MapViewProps {
  sportsCenters: SportsCenter[];
  userLocation?: { latitude: number; longitude: number };
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

const MapView: React.FC<MapViewProps> = ({ sportsCenters, userLocation, calculateDistance }) => {
  const [hoveredCenter, setHoveredCenter] = useState<string | null>(null);
  
  // Default center (San Francisco)
  const defaultCenter: LatLngExpression = [37.7749, -122.4194];
  const center = userLocation 
    ? [userLocation.latitude, userLocation.longitude] as LatLngExpression 
    : defaultCenter;

  return (
    <MapWrapper data-testid="map-view">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <>
            <RecenterMap position={center} />
            <Marker 
              position={[userLocation.latitude, userLocation.longitude]} 
              icon={new Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>Your Location</Popup>
            </Marker>
          </>
        )}
        
        {sportsCenters.map((center) => {
          const isHovered = hoveredCenter === center.id;
          
          // Get minimum price (assuming we might have facilities in the future)
          // For now, just use a placeholder value or calculate from available data
          const minPrice = 20; // Default placeholder price
          
          // Calculate distance if user location is available
          let distance = null;
          if (userLocation && center.location) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              center.location.latitude,
              center.location.longitude
            );
          }
          
          return (
            <Marker 
              key={center.id}
              position={[center.location.latitude, center.location.longitude]}
              icon={DefaultIcon}
              eventHandlers={{
                mouseover: () => setHoveredCenter(center.id),
                mouseout: () => setHoveredCenter(null),
                click: () => setHoveredCenter(center.id)
              }}
            >
              {(isHovered || true) && (
                <Popup>
                  <PopupContent>
                    <PopupTitle>{center.name}</PopupTitle>
                    <PopupAddress>{center.address}, {center.city}</PopupAddress>
                    
                    <PopupInfo>
                      <PopupPrice>From ${minPrice}/hr</PopupPrice>
                      {distance !== null && <PopupDistance>{distance.toFixed(1)} km away</PopupDistance>}
                    </PopupInfo>
                    
                    <PopupSports>
                      {center.sports.slice(0, 3).map((sport) => (
                        <SportTag key={sport.id}>{sport.name}</SportTag>
                      ))}
                    </PopupSports>
                  </PopupContent>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </MapWrapper>
  );
};

export default MapView; 