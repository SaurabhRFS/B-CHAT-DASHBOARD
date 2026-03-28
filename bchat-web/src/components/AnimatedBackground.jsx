import React from 'react';

const AnimatedBackground = React.memo(() => {
  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0 pointer-events-none bg-slate-50"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-1"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-2 [animation-delay:2000ms]"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-3 [animation-delay:4000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-1 [animation-delay:1000ms]"></div>
      <div className="absolute top-[40%] left-[20%] w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-2 [animation-delay:500ms]"></div>
      <div className="absolute top-[10%] left-[50%] w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-3 [animation-delay:2500ms]"></div>
      <div className="absolute bottom-[10%] right-[40%] w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-wander-1 [animation-delay:1500ms]"></div>

      <div className="absolute top-[20%] right-[20%] w-32 h-32 bg-red-300 rounded-full mix-blend-multiply filter blur-md opacity-80 animate-wander-slow-1"></div>
      <div className="absolute bottom-[30%] left-[40%] w-24 h-24 bg-green-300 rounded-full mix-blend-multiply filter blur-md opacity-80 animate-wander-slow-2 [animation-delay:1000ms]"></div>
      <div className="absolute top-[50%] right-[50%] w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-md opacity-90 animate-wander-slow-1 [animation-delay:3000ms]"></div>
      <div className="absolute bottom-[10%] left-[10%] w-36 h-36 bg-violet-300 rounded-full mix-blend-multiply filter blur-md opacity-80 animate-wander-slow-2 [animation-delay:2000ms]"></div>
      <div className="absolute top-[5%] right-[30%] w-24 h-24 bg-amber-200 rounded-full mix-blend-multiply filter blur-md opacity-80 animate-wander-slow-1 [animation-delay:4000ms]"></div>
    </div>
  );
});

export default AnimatedBackground;