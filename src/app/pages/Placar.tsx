import React, { useState, useEffect } from 'react';
import { Maximize, Minimize, RotateCcw, ArrowLeftRight, X, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Placar() {
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const resetScores = () => {
    setScoreHome(0);
    setScoreAway(0);
  };

  const swapSides = () => {
    setSwapped(!swapped);
  };

  const incrementHome = () => setScoreHome(prev => prev + 1);
  const decrementHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScoreHome(prev => Math.max(0, prev - 1));
  };

  const incrementAway = () => setScoreAway(prev => prev + 1);
  const decrementAway = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScoreAway(prev => Math.max(0, prev - 1));
  };

  const teamLeft = swapped ? { name: 'VISITANTE', score: scoreAway, increment: incrementAway, decrement: decrementAway, color: 'bg-[#8b2020]' } : { name: 'CASA', score: scoreHome, increment: incrementHome, decrement: decrementHome, color: 'bg-[#2188ff]' };
  
  const teamRight = swapped ? { name: 'CASA', score: scoreHome, increment: incrementHome, decrement: decrementHome, color: 'bg-[#2188ff]' } : { name: 'VISITANTE', score: scoreAway, increment: incrementAway, decrement: decrementAway, color: 'bg-[#8b2020]' };

  return (
    <div className="h-screen w-screen flex flex-col font-sans overflow-hidden bg-[#1a1a1a] text-white">
      {/* Top Bar */}
      <div className="h-14 bg-[#111] flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
              <span className="font-bold text-lg text-white">S</span>
            </div>
            <span className="font-bold hidden sm:inline-block">SportConnect</span>
          </Link>
          <span className="text-gray-400 font-medium">Placar Digital</span>
        </div>
        
        <div className="flex items-center gap-2">
          {!isFullscreen && (
            <Link to="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors mr-2 flex items-center justify-center" title="Sair">
              <X className="w-5 h-5 text-gray-300" />
            </Link>
          )}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button onClick={() => setIsRotated(!isRotated)} className="p-2 hover:bg-white/20 rounded transition-colors" title="Girar Tela (Para Celular)">
              <Smartphone className="w-5 h-5" />
            </button>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded transition-colors" title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}>
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button onClick={resetScores} className="p-2 hover:bg-white/20 rounded transition-colors" title="Zerar Placar">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={swapSides} className="p-2 hover:bg-white/20 rounded transition-colors" title="Inverter Lados">
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Score Area */}
      <div className={`flex-1 flex ${isRotated ? 'flex-col' : 'flex-col md:flex-row'} w-full h-full relative`}>
        
        {/* Left Side */}
        <div 
          onClick={teamLeft.increment}
          className={`flex-1 flex flex-col items-center justify-center relative cursor-pointer select-none transition-colors duration-500 ${teamLeft.color} ${isRotated ? '' : ''}`}
        >
          <div className={`flex flex-col items-center justify-center w-full h-full ${isRotated ? 'rotate-90' : ''}`}>
            <h2 className="absolute top-8 md:top-12 text-3xl md:text-5xl font-bold tracking-wider">{teamLeft.name}</h2>
            
            <motion.div 
              key={teamLeft.score}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[25vh] md:text-[40vh] font-bold leading-none tabular-nums"
            >
              {teamLeft.score}
            </motion.div>

            <button 
              onClick={teamLeft.decrement}
              className="absolute bottom-8 md:bottom-12 w-16 h-12 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all text-4xl"
            >
              -
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div 
          onClick={teamRight.increment}
          className={`flex-1 flex flex-col items-center justify-center relative cursor-pointer select-none transition-colors duration-500 ${teamRight.color} ${isRotated ? '' : ''}`}
        >
          <div className={`flex flex-col items-center justify-center w-full h-full ${isRotated ? 'rotate-90' : ''}`}>
            <h2 className="absolute top-8 md:top-12 text-3xl md:text-5xl font-bold tracking-wider">{teamRight.name}</h2>
            
            <motion.div 
              key={teamRight.score}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[25vh] md:text-[40vh] font-bold leading-none tabular-nums"
            >
              {teamRight.score}
            </motion.div>

            <button 
              onClick={teamRight.decrement}
              className="absolute bottom-8 md:bottom-12 w-16 h-12 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all text-4xl"
            >
              -
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
