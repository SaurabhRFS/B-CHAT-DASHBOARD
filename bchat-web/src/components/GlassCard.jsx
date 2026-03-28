import React from 'react';

const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`backdrop-blur-xl bg-white/40 border border-white/40 shadow-2xl rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;