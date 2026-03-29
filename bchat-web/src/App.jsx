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

  // Completely bulletproof parser
  const parsePayload = (data) => {
    if (!data) return [];

    return Object.entries(data).map(([id, payloadString]) => {
      if (typeof payloadString !== 'string') return null;

      const parts = payloadString.split('|');
      
      // Dynamically find where "SOS" is in the string. 
      // This ignores the UUID whether it is there or not.
      const sosIndex = parts.indexOf("SOS");

      // If "SOS" is not in the string at all, discard it.
      if (sosIndex === -1) return null;

      // Ensure we have enough data parts after "SOS" to prevent crashes
      if (parts.length < sosIndex + 6) return null;

      // Extract data relative to wherever "SOS" was found
      const severity = parts[sosIndex + 1];
      const nodeName = parts[sosIndex + 2];
      const lat = parseFloat(parts[sosIndex + 3]);
      const lng = parseFloat(parts[sosIndex + 4]);
      const timestamp = parseInt(parts[sosIndex + 5]);

      // CRITICAL: Prevent Leaflet crash by checking for NaN
      if (isNaN(lat) || isNaN(lng)) {
        console.warn("Discarded invalid coordinates for:", nodeName);
        return null;
      }

      // Check the very last part of the string for the mission status
      let status = "PENDING";
      const lastPart = parts[parts.length - 1];
      if (lastPart === "ONGOING") {
        status = "ONGOING";
      } else if (lastPart === "ACCEPTED") {
        status = "ACCEPTED";
      }

      return {
        id: id,
        severity: severity,
        nodeName: nodeName,
        lat: lat,
        lng: lng,
        timestamp: timestamp,
        status: status,
        raw: payloadString
      };
    }).filter(alert => alert !== null);
  };

  useEffect(() => {
    const activeRef = ref(database, 'sos_alerts');
    const archiveRef = ref(database, 'resolved_alerts');
    
    const unsubActive = onValue(activeRef, (snapshot) => {
      if (snapshot.exists()) {
        const parsed = parsePayload(snapshot.val());
        setAlerts(parsed);
        // Automatically pan map to the latest valid alert
        if (parsed.length > 0) {
          setMapCenter([parsed[parsed.length - 1].lat, parsed[parsed.length - 1].lng]);
        }
      } else {
        setAlerts([]);
      }
    });

    const unsubArchive = onValue(archiveRef, (snapshot) => {
      if (snapshot.exists()) {
        setArchivedAlerts(parsePayload(snapshot.val()));
      } else {
        setArchivedAlerts([]);
      }
    });

    return () => { unsubActive(); unsubArchive(); };
  }, []);

  // 3-Step Mission Progression Handler
  const handleStatusAdvance = (alert) => {
    const activeRef = ref(database, `sos_alerts/${alert.id}`);
    const archiveRef = ref(database, `resolved_alerts/${alert.id}`);
    
    if (alert.status === "PENDING") {
      // Step 1: Clicked "Start Rescue" -> Moves to ONGOING
      set(activeRef, alert.raw + "|ONGOING");
    } 
    else if (alert.status === "ONGOING") {
      // Step 2: Clicked "Ongoing Rescue" -> Moves to ACCEPTED
      const newRaw = alert.raw.replace("|ONGOING", "|ACCEPTED");
      set(activeRef, newRaw);
    } 
    else if (alert.status === "ACCEPTED") {
      // Step 3: Clicked "Accept" -> Moves to Resolved Archive
      const cleanRaw = alert.raw.replace("|ACCEPTED", "");
      set(archiveRef, cleanRaw)
        .then(() => remove(activeRef))
        .catch(error => console.error("Archive error: ", error));
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans text-slate-800 flex flex-col">
      <AnimatedBackground />
      
      {/* Context Header */}
      <div className="relative z-20 bg-slate-900 text-slate-100 p-4 shadow-lg flex-shrink-0">
        <h1 className="text-xl font-bold text-blue-400 mb-1">Intelligent Disaster Coordination System</h1>
        <p className="text-xs text-slate-300 leading-tight max-w-6xl">
          <span className="font-semibold text-slate-100">Context:</span> Disaster response involves multiple agencies and rapidly changing conditions. Lack of centralized intelligence delays relief efforts.<br/>
          <span className="font-semibold text-slate-100">Mission:</span> Process incoming multi-source reports, assist in relief planning, prioritize tasks, and allocate resources efficiently.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-grow overflow-hidden">
        <div className="h-[45%] w-full shadow-md z-10">
          <MapWindow alerts={alerts} mapCenter={mapCenter} />
        </div>
        <div className="h-[55%] w-full bg-slate-50/90 backdrop-blur-md overflow-hidden">
          <AlertList 
            alerts={alerts} 
            onAdvanceStatus={handleStatusAdvance} 
          />
        </div>
      </div>
    </div>
  );
}