import { useMemo } from 'react';
import HomeHero from "./HomeHero";
import StatusCard from "./StatusCard";
import PrimaryAction from "./PrimaryAction";

// 🎯 RESPONSIVE + PERFORMANCE + ACCESSIBILITY
const AppShell = ({ stats = {}, setStats }) => {
  // 🌀 CSS-IN-JS OTIMIZADO (1x render)
  const styles = useMemo(() => ({
    root: {
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0b1f17 0%, #020806 50%, #010502 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'clamp(20px, 5vw, 36px)',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      // 🎨 MICRO ANIMATIONS
      animation: 'fadeInShell 0.8s cubic-bezier(0.23,1,0.32,1)',
    },
    app: {
      width: '100%',
      maxWidth: '540px',
      minHeight: '680px',
      background: `
        linear-gradient(145deg, rgba(7,20,15,0.95), rgba(3,8,6,0.98)),
        radial-gradient(circle at 20% 80%, rgba(42,255,143,0.08), transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(26,191,115,0.06), transparent 50%)
      `,
      backdropFilter: 'blur(24px) saturate(120%)',
      borderRadius: '32px',
      padding: 'clamp(28px, 6vw, 44px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(28px, 6vw, 40px)',
      boxShadow: `
        0 32px 80px rgba(0,0,0,0.85),
        0 0 0 1px rgba(42,255,143,0.12),
        inset 0 1px 0 rgba(255,255,255,0.08)
      `,
      border: '1px solid rgba(42,255,143,0.15)',
      position: 'relative',
      // 🌟 RESPONSIVE SCALE
      transform: 'scale(0.98)',
      transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
      // 🎮 HOVER EFFECT MOBILE
      ':hover': {
        transform: 'scale(0.99)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(42,255,143,0.2)'
      }
    },
    // 🌿 BACKGROUND PARTICLES
    particles: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.3
    }
  }), []);

  return (
    <>
      {/* 🌌 BACKGROUND PARTICLES */}
      <div style={styles.particles}>
        <div style={{
          position: 'absolute',
          width: '4px', height: '4px',
          background: '#2aff8f', borderRadius: '50%',
          top: '20%', left: '10%', animation: 'float 20s infinite linear'
        }} />
        <div style={{
          position: 'absolute',
          width: '2px', height: '2px',
          background: '#1dbf73', borderRadius: '50%',
          top: '60%', right: '15%', animation: 'float 25s infinite linear reverse'
        }} />
        <div style={{
          position: 'absolute',
          width: '3px', height: '3px',
          background: '#7fe0b4', borderRadius: '50%',
          bottom: '30%', left: '25%', animation: 'float 18s infinite linear'
        }} />
      </div>

      {/* 🏛️ MAIN SHELL */}
      <main style={styles.root} role="main" aria-label="VerdeX App">
        <div style={styles.app}>
          <HomeHero stats={stats} />
          <StatusCard stats={stats} />
          <PrimaryAction stats={stats} setStats={setStats} />
        </div>
      </main>
    </>
  );
};

// 🎨 CSS ANIMATIONS GLOBAL (1x)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInShell {
    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes float {
    0% { transform: translateY(100vh) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AppShell;
