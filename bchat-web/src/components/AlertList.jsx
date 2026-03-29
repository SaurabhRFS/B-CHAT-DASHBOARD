import React, { useState } from 'react';

export default function AlertList({ alerts, archivedAlerts, onAdvanceStatus }) {
  const [viewMode, setViewMode] = useState('live');

  const sortedAlerts = [...alerts].sort((a, b) => a.timestamp - b.timestamp);

  const redAlerts = sortedAlerts.filter(a => a.severity === "RED");
  const orangeAlerts = sortedAlerts.filter(a => a.severity === "ORANGE");
  const yellowAlerts = sortedAlerts.filter(a => a.severity === "YELLOW");

  const totalActive = alerts.length;
  const ongoingCount = alerts.filter(a => a.status === "ONGOING").length;
  const archivedCount = archivedAlerts ? archivedAlerts.length : 0;

  const AlertCard = ({ alert, colorClass, isArchive = false }) => {
    let buttonText = "START RESCUE";
    let buttonColor = "bg-blue-600 hover:bg-blue-700 text-white";

    if (alert.status === "ONGOING") {
      buttonText = "ONGOING RESCUE";
      buttonColor = "bg-amber-500 hover:bg-amber-600 text-slate-900";
    } else if (alert.status === "RESCUED") {
      buttonText = "RESCUED (ARCHIVE)";
      buttonColor = "bg-green-600 hover:bg-green-700 text-white";
    }

    return (
      <div className={`p-4 mb-4 rounded-xl border-l-8 shadow-md bg-white ${colorClass}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-extrabold text-lg uppercase text-slate-900 tracking-wider">
              {alert.nodeName}
            </h3>
            <p className="text-sm font-bold text-slate-600 mt-1">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
          
          {/* Upgraded Coordinates Block */}
          <div className="text-right bg-slate-100 p-2 rounded border border-slate-300 shadow-inner">
            <p className="text-sm font-black font-mono text-slate-800">
              LAT: {alert.lat.toFixed(5)}
            </p>
            <p className="text-sm font-black font-mono text-slate-800 mt-1">
              LNG: {alert.lng.toFixed(5)}
            </p>
          </div>
        </div>

        {!isArchive ? (
          <button 
            onClick={() => onAdvanceStatus(alert)}
            className={`w-full py-3 mt-2 text-sm font-black tracking-wide rounded-lg transition-all uppercase shadow-sm ${buttonColor}`}
          >
            {buttonText}
          </button>
        ) : (
          <div className="w-full py-3 mt-2 text-sm font-black uppercase tracking-wide rounded-lg bg-slate-200 text-slate-600 text-center border border-slate-300">
            Resolved & Archived
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4">
      
      {/* Top Metrics and Control Bar */}
      <div className="flex justify-between items-end mb-4 border-b-2 border-slate-300 pb-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">
            {viewMode === 'live' ? 'Live Triage Board' : 'Mission Archives'}
          </h2>
          <div className="flex gap-5 mt-2 text-sm font-extrabold uppercase tracking-wider">
            <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded">Active: {totalActive}</span>
            <span className="text-amber-700 bg-amber-100 px-2 py-1 rounded">Ongoing: {ongoingCount}</span>
            <span className="text-slate-700 bg-slate-200 px-2 py-1 rounded">Archived: {archivedCount}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setViewMode(viewMode === 'live' ? 'archived' : 'live')}
          className="px-5 py-2.5 bg-slate-800 text-white text-sm font-black uppercase tracking-wide rounded-lg hover:bg-slate-700 shadow-md transition"
        >
          {viewMode === 'live' ? 'View Archives' : 'Back to Live Board'}
        </button>
      </div>
      
      {/* Content Area */}
      {viewMode === 'live' ? (
        <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">
          <div className="flex flex-col bg-red-50/80 rounded-xl border-2 border-red-200 p-3 overflow-y-auto h-full shadow-inner">
            <h3 className="sticky top-0 bg-red-200 text-red-900 font-black uppercase tracking-widest text-center py-2 mb-4 rounded-lg shadow-sm text-sm border border-red-300">
              CRITICAL (RED) - {redAlerts.length}
            </h3>
            {redAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} colorClass="border-red-600" />
            ))}
          </div>

          <div className="flex flex-col bg-orange-50/80 rounded-xl border-2 border-orange-200 p-3 overflow-y-auto h-full shadow-inner">
            <h3 className="sticky top-0 bg-orange-200 text-orange-900 font-black uppercase tracking-widest text-center py-2 mb-4 rounded-lg shadow-sm text-sm border border-orange-300">
              HIGH (ORANGE) - {orangeAlerts.length}
            </h3>
            {orangeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} colorClass="border-orange-500" />
            ))}
          </div>

          <div className="flex flex-col bg-yellow-50/80 rounded-xl border-2 border-yellow-200 p-3 overflow-y-auto h-full shadow-inner">
            <h3 className="sticky top-0 bg-yellow-200 text-yellow-900 font-black uppercase tracking-widest text-center py-2 mb-4 rounded-lg shadow-sm text-sm border border-yellow-300">
              MODERATE (YELLOW) - {yellowAlerts.length}
            </h3>
            {yellowAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} colorClass="border-yellow-500" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col bg-slate-100 rounded-xl border-2 border-slate-300 p-4 overflow-y-auto h-full shadow-inner">
           <div className="grid grid-cols-3 gap-5">
              {archivedAlerts && archivedAlerts.length > 0 ? (
                [...archivedAlerts].sort((a, b) => b.timestamp - a.timestamp).map(alert => (
                   <AlertCard key={alert.id} alert={alert} colorClass="border-slate-500 opacity-90" isArchive={true} />
                ))
              ) : (
                <div className="col-span-3 text-center text-slate-600 mt-10 font-bold text-lg">No archived missions yet.</div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}





















// import { useState } from 'react';
// import GlassCard from './GlassCard';

// export default function AlertList({ alerts, archivedAlerts, onMarkDone }) {
//   const [showArchived, setShowArchived] = useState(false);

//   const formatTime = (ms) => {
//     if (!ms) return "Time unknown";
//     return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//   };

//   const getSeverityStyle = (severity) => {
//     if (severity === 'YELLOW') return { text: 'text-yellow-600', border: 'border-yellow-400' };
//     if (severity === 'ORANGE') return { text: 'text-orange-500', border: 'border-orange-400' };
//     return { text: 'text-red-600', border: 'border-red-400' }; // Default RED
//   };

//   const displayList = showArchived ? archivedAlerts : alerts;

//   return (
//     <div className="w-full h-full p-6 overflow-y-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">
//           {showArchived ? "Archived Signals" : "Active SOS Signals"} ({displayList.length})
//         </h2>
//         <button 
//           onClick={() => setShowArchived(!showArchived)}
//           className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-bold transition-colors"
//         >
//           {showArchived ? "View Active" : "View Archived"}
//         </button>
//       </div>
      
//       {displayList.length === 0 ? (
//         <div className="text-slate-500 italic">No records found.</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayList.map((alert) => {
//             const style = getSeverityStyle(alert.severity);
            
//             return (
//               <GlassCard key={alert.id} className={`flex flex-col justify-between ${style.border}`}>
//                 <div>
//                   <div className="flex justify-between items-start">
//                     <div className={`font-bold text-xl ${showArchived ? 'text-slate-500' : style.text}`}>
//                       [{alert.severity}] {alert.nodeName}
//                     </div>
//                     <div className="text-xs font-bold bg-white/50 px-2 py-1 rounded">
//                       {formatTime(alert.timestamp)}
//                     </div>
//                   </div>
//                   <div className="text-sm text-slate-700 mt-3 font-mono bg-white/30 p-2 rounded">
//                     Lat: {alert.lat.toFixed(6)}<br/>
//                     Lng: {alert.lng.toFixed(6)}
//                   </div>
//                 </div>
                
//                 {!showArchived && (
//                   <button 
//                     onClick={() => onMarkDone(alert)}
//                     className="mt-4 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-bold w-full"
//                   >
//                     MARK AS RESOLVED
//                   </button>
//                 )}
//               </GlassCard>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }