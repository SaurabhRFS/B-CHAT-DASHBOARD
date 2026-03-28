import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapWindow({ alerts, mapCenter }) {
  
  // Create a dynamic, colored dot icon
  const createCustomIcon = (severity) => {
    let color = '#ef4444'; // Default Red
    if (severity === 'YELLOW') color = '#eab308';
    if (severity === 'ORANGE') color = '#f97316';

    return L.divIcon({
      className: 'custom-colored-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.5);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="w-full h-full relative z-10 shadow-lg border-b-4 border-slate-800">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {alerts.map((alert) => (
          <Marker key={alert.id} position={[alert.lat, alert.lng]} icon={createCustomIcon(alert.severity)}>
            <Popup>
              <strong style={{ color: alert.severity === 'YELLOW' ? '#ca8a04' : alert.severity === 'ORANGE' ? '#c2410c' : '#b91c1c' }}>
                {alert.severity} PRIORITY: {alert.nodeName}
              </strong><br />
              Lat: {alert.lat.toFixed(5)}<br />
              Lng: {alert.lng.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}