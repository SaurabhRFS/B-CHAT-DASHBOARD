import { useState } from 'react';
import GlassCard from './GlassCard';

export default function AlertList({ alerts, archivedAlerts, onMarkDone }) {
  const [showArchived, setShowArchived] = useState(false);

  const formatTime = (ms) => {
    if (!ms) return "Time unknown";
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getSeverityStyle = (severity) => {
    if (severity === 'YELLOW') return { text: 'text-yellow-600', border: 'border-yellow-400' };
    if (severity === 'ORANGE') return { text: 'text-orange-500', border: 'border-orange-400' };
    return { text: 'text-red-600', border: 'border-red-400' }; // Default RED
  };

  const displayList = showArchived ? archivedAlerts : alerts;

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {showArchived ? "Archived Signals" : "Active SOS Signals"} ({displayList.length})
        </h2>
        <button 
          onClick={() => setShowArchived(!showArchived)}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-bold transition-colors"
        >
          {showArchived ? "View Active" : "View Archived"}
        </button>
      </div>
      
      {displayList.length === 0 ? (
        <div className="text-slate-500 italic">No records found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            
            return (
              <GlassCard key={alert.id} className={`flex flex-col justify-between ${style.border}`}>
                <div>
                  <div className="flex justify-between items-start">
                    <div className={`font-bold text-xl ${showArchived ? 'text-slate-500' : style.text}`}>
                      [{alert.severity}] {alert.nodeName}
                    </div>
                    <div className="text-xs font-bold bg-white/50 px-2 py-1 rounded">
                      {formatTime(alert.timestamp)}
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 mt-3 font-mono bg-white/30 p-2 rounded">
                    Lat: {alert.lat.toFixed(6)}<br/>
                    Lng: {alert.lng.toFixed(6)}
                  </div>
                </div>
                
                {!showArchived && (
                  <button 
                    onClick={() => onMarkDone(alert)}
                    className="mt-4 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-bold w-full"
                  >
                    MARK AS RESOLVED
                  </button>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}