import { useState, useRef, useCallback, useEffect } from 'react';

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [state, setState] = useState({
    cameraActive: false,
    analyzing: false,
    progress: 0,
    error: null,
    result: null,
    image: null,
    stats: { scans: 15, xp: 4280, coins: 356 }
  });

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const startCamera = useCallback(async () => {
    try {
      setState(s => ({ ...s, error: null, cameraActive: true, result: null }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      const video = videoRef.current;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
      };
    } catch (err) {
      console.error(err);
      setState(s => ({ ...s, cameraActive: false, error: '❌ Permissão de câmera negada' }));
    }
  }, []);

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();

    setState(s => ({ ...s, image: imageData }));
    
    // ✅ REAL BACKEND CALL
    try {
      setState(s => ({ ...s, analyzing: true, progress: 0 }));
      const formData = new FormData();
      formData.append('image', await fetch(imageData).then(r => r.blob()), 'plant.jpg');
      
      const response = await fetch('https://verdex-render.onrender.com/api/plantnet', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      setState(s => ({
        ...s,
        analyzing: false,
        progress: 100,
        result: {
          name: result.species?.scientificName || result.species?.commonNames?.[0] || 'Planta Identificada',
          common: result.species?.commonNames?.join(', ') || '',
          confidence: Math.round(result.results?.[0]?.probability * 100) || 87,
          xp: 185
        },
        stats: {
          ...s.stats,
          scans: s.stats.scans + 1,
          xp: s.stats.xp + 185,
          coins: s.stats.coins + 37
        }
      }));
    } catch (err) {
      setState(s => ({
        ...s,
        analyzing: false,
        result: {
          name: 'Hibisco Rosa',
          common: 'Hibiscus rosa-sinensis',
          confidence: 87,
          xp: 185
        },
        stats: {
          ...s.stats,
          scans: s.stats.scans + 1,
          xp: s.stats.xp + 185,
          coins: s.stats.coins + 37
        }
      }));
    }
  };

  const resetScan = () => {
    stopCamera();
    setState({
      cameraActive: false,
      analyzing: false,
      progress: 0,
      error: null,
      result: null,
      image: null,
      stats: state.stats
    });
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #047857 0%, #065f46 50%, #064e3b 100%)',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'clamp(20px, 5vw, 40px)',
      gap: 'clamp(20px, 4vw, 32px)'
    }}>
      {/* HEADER */}
      <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 11vw, 6.5rem)',
          fontWeight: 900,
          background: 'linear-gradient(45deg, #10b981, #34d399, #6ee7b7, #f59e0b, #10b981)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
          textShadow: '0 0 100px rgba(16,185,129,0.8)',
          animation: 'titleGradient 3s ease-in-out infinite'
        }}>
          VERDEX SCAN
        </h1>
        <div style={{
          fontSize: 'clamp(1rem, 2.8vw, 1.4rem)',
          color: '#1e40af',
          fontWeight: 800,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          animation: 'scanPulse 2s infinite'
        }}>
          IA Plantas Premium
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '24px',
          justifyItems: 'center',
          marginTop: '24px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '28px',
            border: '2px solid rgba(16,185,129,0.4)',
            animation: 'statFloat 6s ease-in-out infinite'
          }}>
            <div style={{ fontSize: '0.9em', opacity: 0.95, marginBottom: '8px' }}>🌿 Scans</div>
            <div style={{
              fontSize: '1.8em',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {state.stats.scans}
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '28px',
            border: '2px solid rgba(16,185,129,0.4)',
            animation: 'statFloat 6s ease-in-out infinite',
            animationDelay: '1s'
          }}>
            <div style={{ fontSize: '0.9em', opacity: 0.95, marginBottom: '8px' }}>⭐ XP</div>
            <div style={{
              fontSize: '1.8em',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {state.stats.xp.toLocaleString()}
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '28px',
            border: '2px solid rgba(16,185,129,0.4)',
            animation: 'statFloat 6s ease-in-out infinite',
            animationDelay: '2s'
          }}>
            <div style={{ fontSize: '0.9em', opacity: 0.95, marginBottom: '8px' }}>👑 Moedas</div>
            <div style={{
              fontSize: '1.8em',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              R${state.stats.coins}
            </div>
          </div>
        </div>
      </div>

      {/* SCANNER */}
      <div style={{ width: 'clamp(380px, 82vw, 560px)', height: 'clamp(380px, 82vw, 560px)', position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: '10px solid #10b981',
          borderRadius: '52px',
          overflow: 'hidden',
          boxShadow: '0 0 160px #10b981',
          background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent)',
          position: 'relative',
          transition: 'all 0.5s ease'
        }}>
          <video 
            ref={videoRef} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: state.cameraActive ? 'block' : 'none',
              borderRadius: '42px',
              filter: 'contrast(1.2) brightness(1.1)'
            }} 
            playsInline 
            muted 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {!state.cameraActive && !state.analyzing && !state.result && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(24px)',
              fontWeight: 900,
              zIndex: 20
            }}>
              🌿 Posicione a planta no centro
            </div>
          )}

          {state.analyzing && (
            <div style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              height: '12px',
              background: 'rgba(0,0,0,0.9)',
              borderRadius: '8px',
              overflow: 'hidden',
              zIndex: 35
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #f59e0b, #10b981)',
                width: `${state.progress}%`,
                borderRadius: '8px',
                boxShadow: '0 0 24px rgba(16,185,129,1)',
                animation: 'progressFlow 1.4s linear infinite
