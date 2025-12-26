/* =========================================================
   VERDEX UBER ENGINE — GOD MODE
   Gerencia Jobs, Comissões, Trabalhadores e Eventos
   ========================================================= */

export const uberEngine = (setUberSystem, setGlobalMetrics, xpSystem) => {
  // Sistema de eventos interno
  const events = [];
  const triggerEvent = (eventName, payload = {}) => {
    events.push({ eventName, payload, timestamp: Date.now() });
    console.log(`🚀 Evento UberEngine: ${eventName}`, payload);
  };

  return {
    // Cria um job e calcula comissões automaticamente
    createJob: (jobData) => {
      const jobId = `JOB_${Date.now()}`;
      const totalValue = jobData.value;
      const founderCut = totalValue * 0.15;  // 15% fundador
      const workerCut = totalValue * 0.75;   // 75% trabalhador
      const platformCut = totalValue * 0.10; // 10% plataforma

      const newJob = {
        id: jobId,
        ...jobData,
        status: 'active',
        commissions: { founder: founderCut, worker: workerCut, platform: platformCut },
        createdAt: new Date().toISOString()
      };

      // Atualiza estado UberSystem
      setUberSystem(prev => ({
        ...prev,
        activeJobs: [newJob, ...prev.activeJobs.slice(0, 9)]
      }));

      // Atualiza métricas globais
      setGlobalMetrics(prev => ({
        ...prev,
        founderEarnings: prev.founderEarnings + founderCut,
        totalJobsCompleted: prev.totalJobsCompleted + 1
      }));

      // Ganha XP por criar job
      xpSystem.addXP(Math.floor(totalValue / 10), "Job criado");

      // Dispara evento interno
      triggerEvent("job_created", newJob);

      return newJob;
    },

    // Completa um job e distribui comissões
    completeJob: (jobId) => {
      setUberSystem(prev => {
        const updatedJobs = prev.activeJobs.map(j => 
          j.id === jobId ? { ...j, status: 'completed' } : j
        );
        return { ...prev, activeJobs: updatedJobs };
      });

      xpSystem.addXP(50, "Job concluído");
      triggerEvent("job_completed", { jobId });
    },

    // Cancelar job
    cancelJob: (jobId) => {
      setUberSystem(prev => {
        const updatedJobs = prev.activeJobs.map(j => 
          j.id === jobId ? { ...j, status: 'cancelled' } : j
        );
        return { ...prev, activeJobs: updatedJobs };
      });

      xpSystem.addXP(-20, "Job cancelado");
      triggerEvent("job_cancelled", { jobId });
    },

    // Obter eventos recentes
    getEvents: () => [...events]
  };
};
