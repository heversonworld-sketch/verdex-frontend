import { lazy, Suspense, useState, useEffect } from 'react';
import AppShell from "./ui/AppShell";
import { AnalyticsProvider } from './context/AnalyticsContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';

const ErrorBoundary = lazy(() => import('./ui/ErrorBoundary'));

// 🎯 PERSISTENCE ENGINE
const useVerdexPersistence = () => {
  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('verdex-stats')) || {
        scans: 0, xp: 0, coins: 0, firstLaunch: true, version: '3.0'
      };
    } catch {
      return { scans: 0, xp: 0, coins: 0, firstLaunch: true, version: '3.0' };
    }
  });

  useEffect(() => {
    localStorage.setItem('verdex-stats', JSON.stringify(stats));
  }, [stats]);

  return [stats, setStats];
};

// 🎯 PERFORMANCE MONITOR
const PerformanceMonitor = ({ children }) => {
  useEffect(() => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint' && entry.name === 'FirstContentfulPaint') {
            console.log('🎨 FCP:', Math.round(entry.startTime), 'ms');
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      return () => observer.disconnect();
    }
  }, []);

  return children;
};

// 🎯 GOD MODE APP
export default function App() {
  const [stats, setStats] = useVerdexPersistence();
  const [isHydrated, setIsHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🌀 HYDRATION SAFETY
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 🎮 ONBOARDING LAUNCH
  useEffect(() => {
    if (stats.firstLaunch) {
      setStats(prev => ({
        ...prev,
        firstLaunch: false,
        xp: prev.xp + 50,
        coins: prev.coins + 10
      }));
    }
  }, [stats.firstLaunch, setStats]);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0b1f17 0%, #020806 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }

  return (
    <PerformanceMonitor>
      <ThemeProvider>
        <SoundProvider>
          <AnalyticsProvider stats={stats} setStats={setStats}>
            <ErrorBoundary>
              <Suspense fallback={null}>
                {isHydrated && <AppShell stats={stats} />}
              </Suspense>
            </ErrorBoundary>
          </AnalyticsProvider>
        </SoundProvider>
      </ThemeProvider>
    </PerformanceMonitor>
  );
}
