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

  const parsePayload = (data) => {
    if (!data) return [];

    return Object.entries(data).map(([id, payloadString]) => {
      if (typeof payloadString !== 'string') return null;

      const parts = payloadString.split('|');
      const sosIndex = parts.indexOf("SOS");

      if (sosIndex === -1) return null;
      if (parts.length < sosIndex + 6) return null;

      const severity = parts[sosIndex + 1];
      const nodeName = parts[sosIndex + 2];
      const lat = parseFloat(parts[sosIndex + 3]);
      const lng = parseFloat(parts[sosIndex + 4]);
      const timestamp = parseInt(parts[sosIndex + 5]);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn("Discarded invalid coordinates for:", nodeName);
        return null;
      }

      let status = "PENDING";
      const lastPart = parts[parts.length - 1];
      
      if (lastPart === "ONGOING") {
        status = "ONGOING";
      } else if (lastPart === "RESCUED") {
        status = "RESCUED";
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

  const handleStatusAdvance = (alert) => {
    const activeRef = ref(database, `sos_alerts/${alert.id}`);
    const archiveRef = ref(database, `resolved_alerts/${alert.id}`);
    
    if (alert.status === "PENDING") {
      set(activeRef, alert.raw + "|ONGOING");
    } 
    else if (alert.status === "ONGOING") {
      const newRaw = alert.raw.replace("|ONGOING", "|RESCUED");
      set(activeRef, newRaw);
    } 
    else if (alert.status === "RESCUED") {
      const cleanRaw = alert.raw.replace("|RESCUED", "");
      set(archiveRef, cleanRaw)
        .then(() => remove(activeRef))
        .catch(error => console.error("Archive error: ", error));
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans text-slate-800 flex flex-col">
      <AnimatedBackground />
      
      <div className="relative z-20 bg-slate-900 text-slate-100 p-4 shadow-lg flex-shrink-0">
        <h1 className="text-xl font-bold text-blue-400 mb-1">Intelligent Disaster Coordination System</h1>
        <p className="text-xs text-slate-300 leading-tight max-w-6xl">
          <span className="font-semibold text-slate-100">Context:</span> Disaster response involves multiple agencies and rapidly changing conditions. Lack of centralized intelligence delays relief efforts.<br/>
          <span className="font-semibold text-slate-100">Mission:</span> Process incoming multi-source reports, assist in relief planning, prioritize tasks, and allocate resources efficiently.
        </p>
      </div>

      <div className="relative z-10 flex flex-col flex-grow overflow-hidden">
        <div className="h-[45%] w-full shadow-md z-10">
          <MapWindow alerts={alerts} mapCenter={mapCenter} />
        </div>


        <div className="h-[55%] w-full bg-slate-50/90 backdrop-blur-md overflow-hidden">
          <AlertList 
            alerts={alerts} 
            archivedAlerts={archivedAlerts} 
            onAdvanceStatus={handleStatusAdvance} 
          />
        </div>

      </div>
    </div>
  );
}










// import React from 'react';

// export default function AlertList({ alerts, onAdvanceStatus }) {
//   const sortedAlerts = [...alerts].sort((a, b) => a.timestamp - b.timestamp);

//   const redAlerts = sortedAlerts.filter(a => a.severity === "RED");
//   const orangeAlerts = sortedAlerts.filter(a => a.severity === "ORANGE");
//   const yellowAlerts = sortedAlerts.filter(a => a.severity === "YELLOW");

//   const AlertCard = ({ alert, colorClass }) => {
//     // Updated button logic
//     let buttonText = "Start Rescue";
//     let buttonColor = "bg-blue-600 hover:bg-blue-700 text-white";

//     if (alert.status === "ONGOING") {
//       buttonText = "Ongoing Rescue";
//       buttonColor = "bg-amber-500 hover:bg-amber-600 text-slate-900";
//     } else if (alert.status === "RESCUED") {
//       buttonText = "Rescued (Archive)";
//       buttonColor = "bg-green-600 hover:bg-green-700 text-white";
//     }

//     return (
//       <div className={`p-3 mb-3 rounded-lg border-l-4 shadow-sm bg-white ${colorClass}`}>
//         <div className="flex justify-between items-start mb-2">
//           <div>
//             <h3 className="font-bold text-sm uppercase">{alert.nodeName}</h3>
//             <p className="text-xs text-slate-500">
//               {new Date(alert.timestamp).toLocaleTimeString()}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] text-slate-400">LAT: {alert.lat.toFixed(4)}</p>
//             <p className="text-[10px] text-slate-400">LNG: {alert.lng.toFixed(4)}</p>
//           </div>
//         </div>

//         <button 
//           onClick={() => onAdvanceStatus(alert)}
//           className={`w-full py-1.5 mt-2 text-xs font-bold rounded transition-colors ${buttonColor}`}
//         >
//           {buttonText}
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="h-full flex flex-col p-4">
//       <h2 className="text-lg font-bold mb-3 text-slate-800">Live Triage Board</h2>
      
//       <div className="grid grid-cols-3 gap-4 h-full overflow-hidden">
        
//         <div className="flex flex-col bg-red-50/50 rounded-lg border border-red-100 p-2 overflow-y-auto h-full">
//           <h3 className="sticky top-0 bg-red-100 text-red-800 font-bold text-center py-1 mb-3 rounded text-sm shadow-sm">
//             CRITICAL (RED) - {redAlerts.length}
//           </h3>
//           {redAlerts.map(alert => (
//             <AlertCard key={alert.id} alert={alert} colorClass="border-red-500" />
//           ))}
//         </div>

//         <div className="flex flex-col bg-orange-50/50 rounded-lg border border-orange-100 p-2 overflow-y-auto h-full">
//           <h3 className="sticky top-0 bg-orange-100 text-orange-800 font-bold text-center py-1 mb-3 rounded text-sm shadow-sm">
//             HIGH (ORANGE) - {orangeAlerts.length}
//           </h3>
//           {orangeAlerts.map(alert => (
//             <AlertCard key={alert.id} alert={alert} colorClass="border-orange-500" />
//           ))}
//         </div>

//         <div className="flex flex-col bg-yellow-50/50 rounded-lg border border-yellow-100 p-2 overflow-y-auto h-full">
//           <h3 className="sticky top-0 bg-yellow-100 text-yellow-800 font-bold text-center py-1 mb-3 rounded text-sm shadow-sm">
//             MODERATE (YELLOW) - {yellowAlerts.length}
//           </h3>
//           {yellowAlerts.map(alert => (
//             <AlertCard key={alert.id} alert={alert} colorClass="border-yellow-400" />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }