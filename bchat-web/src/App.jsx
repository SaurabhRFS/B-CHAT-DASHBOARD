import { useEffect, useState } from 'react';
import { ref, onValue, remove, set } from 'firebase/database';
import { database } from './firebase';
import AnimatedBackground from './components/AnimatedBackground';
import MapWindow from './components/MapWindow';
import AlertList from './components/AlertList';

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [archivedAlerts, setArchivedAlerts] = useState([]);
  const [mapCenter, setMapCenter] = useState([21.1458, 79.0882]); 

  // Updated Helper to parse payload strings
  const parsePayload = (data) => {
    return Object.entries(data).map(([id, payloadString]) => {
      const parts = payloadString.split('|');
      let severity = "RED"; // Default fallback
      let nodeName, lat, lng, timestamp;

      // New Format: SOS | SEVERITY | NodeName | Lat | Lng | Timestamp
      if (parts.length >= 6) {
        severity = parts[1];
        nodeName = parts[2];
        lat = parseFloat(parts[3]);
        lng = parseFloat(parts[4]);
        timestamp = parseInt(parts[5]);
      } 
      // Old Format Fallback
      else if (parts.length === 5) {
        nodeName = parts[1];
        lat = parseFloat(parts[2]);
        lng = parseFloat(parts[3]);
        timestamp = parseInt(parts[4]);
      } else {
        return null;
      }

      return {
        id: id,
        severity: severity,
        nodeName: nodeName,
        lat: lat,
        lng: lng,
        timestamp: timestamp,
        raw: payloadString
      };
    }).filter(alert => alert !== null);
  };

  useEffect(() => {
    const activeRef = ref(database, 'sos_alerts');
    const archiveRef = ref(database, 'resolved_alerts');
    
    // Listen for Active Alerts
    const unsubActive = onValue(activeRef, (snapshot) => {
      if (snapshot.exists()) {
        const parsed = parsePayload(snapshot.val());
        setAlerts(parsed);
        if (parsed.length > 0) {
          setMapCenter([parsed[parsed.length - 1].lat, parsed[parsed.length - 1].lng]);
        }
      } else {
        setAlerts([]);
      }
    });

    // Listen for Archived Alerts
    const unsubArchive = onValue(archiveRef, (snapshot) => {
      if (snapshot.exists()) {
        setArchivedAlerts(parsePayload(snapshot.val()));
      } else {
        setArchivedAlerts([]);
      }
    });

    return () => { unsubActive(); unsubArchive(); };
  }, []);

  // ARCHIVE TRANSACTION
  const handleMarkDone = (alert) => {
    const activeRef = ref(database, `sos_alerts/${alert.id}`);
    const archiveRef = ref(database, `resolved_alerts/${alert.id}`);
    
    set(archiveRef, alert.raw)
      .then(() => remove(activeRef))
      .catch(error => console.error("Archive error: ", error));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans text-slate-800">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col h-full">
        <div className="h-[60%] w-full">
          <MapWindow alerts={alerts} mapCenter={mapCenter} />
        </div>
        <div className="h-[40%] w-full bg-slate-50/30 backdrop-blur-md border-t border-slate-200">
          <AlertList alerts={alerts} archivedAlerts={archivedAlerts} onMarkDone={handleMarkDone} />
        </div>
      </div>
    </div>
  );
}