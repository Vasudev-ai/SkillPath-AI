
'use client';
import { motion } from 'framer-motion';

export const AnimatedAvatar = ({ isWakingUp = false }: { isWakingUp?: boolean }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style jsx>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes rotate-fast {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .orb-1 { animation: rotate-slow 25s linear infinite; }
        .orb-2 { animation: rotate-medium 20s linear infinite; }
        .orb-3 { animation: rotate-fast 15s linear infinite; }
        .core { animation: pulse 4s ease-in-out infinite; }
      `}</style>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="grad-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Outer Rings */}
        <motion.g 
            className="orb-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" />
        </motion.g>
        <motion.g 
            className="orb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ellipse cx="100" cy="100" rx="70" ry="80" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        </motion.g>
         <motion.g 
            className="orb-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
        >
          <ellipse cx="100" cy="100" rx="95" ry="60" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" />
        </motion.g>
        

        {/* Core */}
        <motion.g className="core" filter="url(#glow)">
          <circle cx="100" cy="100" r="30" fill="url(#grad-core)" />
        </motion.g>
      </svg>
    </div>
  );
};
