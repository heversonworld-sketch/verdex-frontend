import { createUberEngine } from "../engines/uberEngine.js";
import { createScannerEngine } from "../engines/scannerEngine.js";
import { gainXP } from "../engines/xpEngine.js";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uberSystem, setUberSystem] = useState({ activeJobs: [] });
  const [globalMetrics, setGlobalMetrics] = useState({ founderEarnings: 0, totalJobsCompleted: 0 });

  const xp = gainXP();
  const uber = uberEngine(setUberSystem, setGlobalMetrics, xp);
  const scanner = scannerEngine();

  return (
    <div style={{ padding: 20 }}>
      <h1>VerdeX Dashboard — God Mode</h1>

      <button onClick={() => uber.createJob({ value: 1000, worker: "Rodrigo" })}>
        Criar Job
      </button>

      <button onClick={() => scanner.takePhoto().then(stream => console.log(stream))}>
        Tirar Foto
      </button>

      <button onClick={() => scanner.pickFromGallery(f => { setFile(f); xp.addXP(50, "galeria"); })}>
        Selecionar da Galeria
      </button>

      {file && <p>Arquivo selecionado: {file.name}</p>}

      <p>XP atual: {xp.getState().xp}</p>
      <p>Level: {xp.getState().level}</p>
      <p>Streak: {xp.getState().streak}</p>
      <p>Jobs ativos: {uberSystem.activeJobs.length}</p>
      <p>Total Jobs completados: {globalMetrics.totalJobsCompleted}</p>
      <p>Founder earnings: R$ {globalMetrics.founderEarnings}</p>
    </div>
  );
};

export default Dashboard;
