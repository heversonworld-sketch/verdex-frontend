import { useState, useMemo } from "react";
import { createUberEngine } from "../engines/uberEngine";
import { createScannerEngine } from "../engines/scannerEngine";
import { gainXP } from "../engines/xpEngine";

import FounderDashboard from "../components/FounderDashboard";
import JobCard from "../components/JobCard";
import ScannerOverlay from "../components/ScannerOverlay";

export default function Dashboard() {
  const [uber, setUber] = useState({ activeJobs: [] });
  const [scanner, setScanner] = useState({ isActive: false });
  const [metrics, setMetrics] = useState({
    xp: 1200,
    level: 3,
    founderEarnings: 0,
    totalJobsCompleted: 0
  });

  const uberEngine = useMemo(
    () => createUberEngine(setUber, setMetrics),
    []
  );

  const scannerEngine = useMemo(
    () => createScannerEngine(setScanner, uberEngine),
    []
  );

  return (
    <main className="app">
      <FounderDashboard metrics={metrics} jobs={uber.activeJobs} />

      <button onClick={scannerEngine.start}>📷 Scanner</button>

      {uber.activeJobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onComplete={uberEngine.completeJob}
        />
      ))}

      <button onClick={() => gainXP(setMetrics, 100)}>+100 XP</button>

      <ScannerOverlay active={scanner.isActive} onStop={scannerEngine.stop} />
    </main>
  );
}
