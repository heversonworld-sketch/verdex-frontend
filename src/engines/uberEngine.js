/* =========================================================
   VERDEX UBER ENGINE — GOD MODE
   Gerencia Jobs, Comissões e Trabalhadores
   ========================================================= */

export const uberEngine = (setUberSystem, setGlobalMetrics) => ({
  createJob: (jobData) => {
    const jobId = `JOB_${Date.now()}`;
    const totalValue = jobData.value;
    const founderCut = totalValue * 0.15;
    const workerCut = totalValue * 0.75;
    const platformCut = totalValue * 0.10;

    const newJob = {
      id: jobId,
      ...jobData,
      status: 'active',
      commissions: { founder: founderCut, worker: workerCut, platform: platformCut },
      createdAt: new Date().toISOString()
    };

    setUberSystem(prev => ({
      ...prev,
      activeJobs: [newJob, ...prev.activeJobs.slice(0, 9)]
    }));

    setGlobalMetrics(prev => ({
      ...prev,
      founderEarnings: prev.founderEarnings + founderCut,
      totalJobsCompleted: prev.totalJobsCompleted + 1
    }));

    return newJob;
  }
});
