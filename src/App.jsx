import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center, Html, useProgress } from '@react-three/drei';
import { CarModel } from './components/CarModel';

const COLORS = [
  { name: 'Crimson Red', hex: '#bc1414' },
  { name: 'Metallic Blue', hex: '#164fa1' },
  { name: 'Pearl White', hex: '#fcfcfc' },
  { name: 'Satin Black', hex: '#1a1a1a' },
  { name: 'Lime Green', hex: '#48a81b' }
];

const GLASS_TINTS = [
  { name: 'Clear', hex: '#ffffff' },
  { name: 'Dark Smoke', hex: '#111111' },
  { name: 'Luxury Green', hex: '#2f4f4f' }
];


function CanvasLoader() {
  const { progress } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0);

  useEffect(() => {
    if (smoothProgress < progress) {
      const timer = setTimeout(() => setSmoothProgress(prev => prev + 1), 5);
      return () => clearTimeout(timer);
    } else if (progress >= 100 && smoothProgress < 100) {
      const timer = setTimeout(() => setSmoothProgress(prev => prev + 1), 3);
      return () => clearTimeout(timer);
    }
  }, [progress, smoothProgress]);

  if (smoothProgress >= 100) return null;

  return (
    
    <Html fullscreen style={{ zIndex: 9999, pointerEvents: 'all' }}>
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#111414', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(15, 15, 15, 0.98)',
          padding: '30px 50px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(25px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          width: '240px',
          textAlign: 'center'
        }}>
        
          <div style={{
            width: '45px',
            height: '45px',
            border: '3px solid rgba(255,255,255,0.03)',
            borderTop: '3px solid #00bcd4',
            borderRight: '3px solid rgba(0, 188, 212, 0.3)',
            borderRadius: '50%',
            animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            marginBottom: '20px'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          
          <div style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
            LOADING MODEL
          </div>
          
          <div style={{ color: '#00bcd4', fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', textShadow: '0 0 10px rgba(0,188,212,0.3)' }}>
            {smoothProgress}%
          </div>
          
          <div style={{ width: '100%', height: '4px', background: '#222', borderRadius: '10px', marginTop: '18px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${smoothProgress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #0097a7 0%, #00bcd4 100%)',
              boxShadow: '0 0 8px #00bcd4',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>
      </div>
    </Html>
  );
}

function App() {
  const [currentColor, setCurrentColor] = useState('#bc1414');
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [selectedWheel, setSelectedWheel] = useState('silver');
  const [cameraView, setCameraView] = useState('default');
  
  const [glassColor, setGlassColor] = useState('#ffffff');
  const [glassOpacity, setGlassOpacity] = useState(0.2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const startAudioRef = useRef(null);
  const idleAudioRef = useRef(null);

  useEffect(() => {
    startAudioRef.current = new Audio('/sounds/car-start.mp3');
    idleAudioRef.current = new Audio('/sounds/car-idle.mp3');

    idleAudioRef.current.loop = true; 
    idleAudioRef.current.volume = 0.6; 
    startAudioRef.current.onended = () => {
      if (idleAudioRef.current) {
        idleAudioRef.current.play().catch(e => console.log("Audio play blocked by browser"));
      }
    };

    return () => {
      if (startAudioRef.current) startAudioRef.current.pause();
      if (idleAudioRef.current) idleAudioRef.current.pause();
    };
  }, []);

  const toggleEngine = () => {
    if (!isEngineOn) {
      setIsEngineOn(true);
      if (idleAudioRef.current) { 
        idleAudioRef.current.pause(); 
        idleAudioRef.current.currentTime = 0; 
      }
      if (startAudioRef.current) {
        startAudioRef.current.currentTime = 0;
        startAudioRef.current.play().catch(e => console.log("Audio interact restriction:", e));
      }
    } else {
      setIsEngineOn(false);
      if (startAudioRef.current) { startAudioRef.current.pause(); startAudioRef.current.currentTime = 0; }
      if (idleAudioRef.current) { idleAudioRef.current.pause(); idleAudioRef.current.currentTime = 0; }
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      background: 'radial-gradient(circle, #232526 0%, #111414 100%)',
      fontFamily: 'sans-serif',
      overflow: 'hidden',
      position: 'relative',
      margin: 0,
      padding: 0
    }}>
      
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          position: fixed !important;
        }

        .canvas-container {
          position: absolute !important;
          left: 0;
          top: 0;
          width: calc(100% - 320px) !important; 
          height: 100% !important;
        }

        .custom-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-sidebar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-sidebar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
        .custom-sidebar::-webkit-scrollbar-thumb:hover {
          background: #00bcd4;
        }
        
        @media (max-width: 768px) {
          .canvas-container {
            width: 100% !important; 
            height: 100% !important;
          }
          .sidebar-panel {
            position: absolute !important;
            right: ${isSidebarOpen ? '0' : '-340px'} !important; 
            top: 0 !important;
            height: 100vh !important;
            width: 300px !important;
            transition: right 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
            box-shadow: ${isSidebarOpen ? '-10px 0 40px rgba(0,0,0,0.8)' : 'none'} !important;
          }
          .menu-toggle-btn {
            display: flex !important;
          }
        }
      `}</style>

      <button 
        className="menu-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          display: 'none', 
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: '#00bcd4',
          border: 'none',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,188,212,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '1px'
        }}
      >
        {isSidebarOpen ? '✕ CLOSE' : '☰ TUNING MENU'}
      </button>

      <div className="canvas-container" style={{ height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', left: '40px', zIndex: 10 }}>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '20px', letterSpacing: '2px' }}>
            MODMYRIDE <span style={{ color: '#00bcd4', fontSize: '11px' }}>// PoC v2.0</span>
          </h1>
        </div>

       
        <Canvas 
          dpr={[1, 2]} 
          shadows 
          camera={{ position: [4, 2, 5], fov: 40 }}
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance", 
            precision: "highp" 
          }}
        >
         
          <Suspense fallback={<CanvasLoader />}>
            <Stage environment="sunset" intensity={0.7} contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.6 }}>
              <Center>
                <CarModel 
                  color={currentColor} 
                  engineOn={isEngineOn} 
                  selectedWheel={selectedWheel} 
                  cameraView={cameraView} 
                  glassColor={glassColor}
                  glassOpacity={glassOpacity}
                />
              </Center>
            </Stage>
          </Suspense>
          <OrbitControls enablePan={false} minDistance={3} maxDistance={8} maxPolarAngle={Math.PI / 2 - 0.05} makeDefault />
        </Canvas>
      </div>

      <div 
        className="sidebar-panel custom-sidebar"
        style={{ 
          position: 'absolute',
          right: 0,
          top: 0,
          width: '320px', 
          height: '100vh',
          background: 'rgba(15, 15, 15, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid #222',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '26px',
          zIndex: 90,
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}
      >
        <div>
          <h3 style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Engine Management</h3>
          <button onClick={toggleEngine} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: isEngineOn ? '#ff3b30' : '#34c759', color: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', letterSpacing: '1px', boxShadow: isEngineOn ? '0 0 20px rgba(255,59,48,0.4)' : '0 0 20px rgba(52,199,89,0.4)', transition: 'all 0.3s ease' }}>
            {isEngineOn ? '🛑 STOP ENGINE' : '🔑 START ENGINE'}
          </button>
        </div>

        <div>
          <h3 style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Camera Angles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['front', 'side', 'rear', 'top'].map((view) => (
              <button key={view} onClick={() => { setCameraView(view); setIsSidebarOpen(false); }} style={{ padding: '10px', background: cameraView === view ? '#00bcd4' : '#222', color: '#fff', border: 'none', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s ease' }}>
                {view} View
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Wheel Customization</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['silver', 'black', 'gold'].map((w) => (
              <button key={w} onClick={() => setSelectedWheel(w)} style={{ flex: 1, padding: '10px 5px', background: selectedWheel === w ? '#00bcd4' : '#222', color: '#fff', border: 'none', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}>
                {w === 'silver' ? 'Silver' : w === 'black' ? 'Matt' : 'Gold'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Body Customization</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => setCurrentColor(c.hex)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: c.hex, border: currentColor === c.hex ? '3px solid #00bcd4' : '2px solid #444', cursor: 'pointer', transform: currentColor === c.hex ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s ease', boxShadow: currentColor === c.hex ? '0 0 12px #00bcd4' : 'none' }} />
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
          <h3 style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Glass Customization</h3>
          <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>Select Tint:</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            {GLASS_TINTS.map((t) => (
              <button key={t.hex} onClick={() => setGlassColor(t.hex)} style={{ flex: 1, padding: '8px', background: glassColor === t.hex ? '#00bcd4' : '#222', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
                {t.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', color: '#aaa', fontSize: '12px' }}>
              <span>Opacity:</span>
              <span style={{ marginLeft: 'auto', color: '#00bcd4', fontWeight: 'bold' }}>{Math.round(glassOpacity * 100)}%</span>
            </div>
            <input type="range" min="0.05" max="0.9" step="0.05" value={glassOpacity} onChange={(e) => setGlassOpacity(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#00bcd4', cursor: 'pointer' }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;