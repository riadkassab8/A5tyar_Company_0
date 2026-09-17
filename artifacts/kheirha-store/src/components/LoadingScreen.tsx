import React from 'react';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  const words = [
    { text: 'طعم', highlight: false },
    { text: 'أصيل', highlight: true },
    { text: 'من', highlight: false },
    { text: 'الزمن', highlight: false },
    { text: 'الجميل', highlight: true },
  ];

  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-[99999999] flex flex-col items-center justify-center p-6 select-none font-sans overflow-hidden"
      style={{
        backgroundColor: '#F7F4EA',
        backgroundImage: 'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #F5F1E4 65%, #ECE7D6 100%)',
        color: '#5C3826',
      }}
    >
      {/* BRAND CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg w-full"
      >
        {/* LUXURY GOLDEN HALO AURA & RIPPLE RING */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[440px] h-96 sm:h-[440px] rounded-full pointer-events-none animate-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(227,179,60,0.22) 0%, rgba(227,179,60,0.05) 55%, transparent 75%)' }}
        />
        
        <motion.div
          animate={{ scale: [0.7, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[320px] h-72 sm:h-[320px] border border-[#E3B33C]/25 rounded-full pointer-events-none"
        />

        {/* LOGO WITH METALLIC SHINE SWEEP */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8 rounded-3xl overflow-hidden p-3"
        >
          <img
            src="/logo-dark.png"
            alt="أختيار - خير مصري أصيل"
            className="w-[440px] sm:w-[480px] max-w-[88vw] h-auto object-contain drop-shadow-[0_16px_36px_rgba(74,46,27,0.12)]"
          />
          {/* Metallic Light Sweep Overlay */}
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-25 pointer-events-none"
            animate={{ left: ['-60%', '140%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>

        {/* SLOGAN (EXPLICIT WARM BROWN & GOLDEN COLOR) */}
        <div className="flex gap-2 justify-center flex-wrap" style={{ marginBottom: '1rem' }}>
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, delay: 0.05 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: word.highlight ? '#C68A1E' : '#5C3826' }}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* ELEGANT FLOATING ORB DOTS (PUSHED DOWN BELOW SLOGAN) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-center gap-3"
          style={{ marginTop: '2.5rem' }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_12px_rgba(198,138,30,0.5)]"
              style={{ background: 'linear-gradient(135deg, #D9A52E, #5C3826)' }}
              animate={{
                y: [0, -6, 0],
                scale: [0.7, 1.3, 0.7],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
