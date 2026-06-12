import React, { useState, useEffect } from 'react';
import { Maximize, Minimize, RotateCcw, ArrowLeftRight, X, Smartphone, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Placar() {
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [fontScale, setFontScale] = useState(1.2); // Default slightly larger

  const increaseSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFontScale(prev => Math.min(prev + 0.2, 3));
  };

  const decreaseSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFontScale(prev => Math.max(prev - 0.2, 0.5));
  };

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
      {/* Floating Controls */}
      <div 
        className="absolute top-4 right-4 z-50 flex items-center bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-xl p-1 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {!isFullscreen && (
          <Link to="/" className="p-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center" title="Sair do Placar">
            <X className="w-6 h-6 text-white" />
          </Link>
        )}
        <div className="w-px h-6 bg-white/20 mx-1 hidden sm:block"></div>
        <button onClick={decreaseSize} className="p-3 hover:bg-white/20 rounded-lg transition-colors" title="Diminuir Tamanho">
          <ZoomOut className="w-6 h-6" />
        </button>
        <button onClick={increaseSize} className="p-3 hover:bg-white/20 rounded-lg transition-colors" title="Aumentar Tamanho">
          <ZoomIn className="w-6 h-6" />
        </button>
        <div className="w-px h-6 bg-white/20 mx-1"></div>
        <button onClick={() => setIsRotated(!isRotated)} className="p-3 hover:bg-white/20 rounded-lg transition-colors" title="Girar Tela (Para Celular)">
          <Smartphone className="w-6 h-6" />
        </button>
        <button onClick={swapSides} className="p-3 hover:bg-white/20 rounded-lg transition-colors" title="Inverter Lados">
          <ArrowLeftRight className="w-6 h-6" />
        </button>
        <button onClick={resetScores} className="p-3 hover:bg-white/20 rounded-lg transition-colors" title="Zerar Placar">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button onClick={toggleFullscreen} className="p-3 hover:bg-white/20 rounded-lg transition-colors" title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}>
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </button>
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
              initial={{ scale: fontScale * 0.8, opacity: 0.5 }}
              animate={{ scale: fontScale, opacity: 1 }}
              className="font-bold leading-none tabular-nums"
              style={{ fontSize: 'min(40vh, 30vw)' }}
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
              initial={{ scale: fontScale * 0.8, opacity: 0.5 }}
              animate={{ scale: fontScale, opacity: 1 }}
              className="font-bold leading-none tabular-nums"
              style={{ fontSize: 'min(40vh, 30vw)' }}
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
