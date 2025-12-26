/* =========================================================
   VERDEX SCANNER ENGINE — GOD MODE
   QR + Barcode + Camera + Galeria
   ========================================================= */

import { uberEngine } from './uberEngine';

export const scannerEngine = {
  startCameraScan: async (setScannerSystem) => {
    setScannerSystem(prev => ({ ...prev, isActive: true }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setScannerSystem(prev => ({ ...prev, cameraStream: stream }));

      // Simula detecção QR
      setTimeout(() => {
        const fakeQR = {
          id: `QR_${Date.now()}`,
          data: `JOB_${Math.floor(Math.random()*1000)}`,
          detectedAt: new Date().toISOString(),
          type: 'job_contract'
        };

        setScannerSystem(prev => ({
          ...prev,
          scanResults: [fakeQR, ...prev.scanResults.slice(0,9)]
        }));

        // Cria Job automaticamente
        uberEngine.createJob({
          title: 'Serviço detectado por QR',
          value: 150.00,
          category: 'manutencao',
          qrId: fakeQR.id
        });

      }, 1500);
    } catch(err) {
      console.log('Scanner permission denied');
    }
  },

  stopCameraScan: (setScannerSystem) => {
    setScannerSystem(prev => ({
      ...prev,
      isActive: false,
      cameraStream: null
    }));
  },

  openGallery: async (event, setScannerSystem) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    const fakeQR = {
      id: `IMG_${Date.now()}`,
      data: `JOB_IMG_${Math.floor(Math.random()*1000)}`,
      detectedAt: new Date().toISOString(),
      type: 'gallery_upload',
      src: imgURL
    };

    setScannerSystem(prev => ({
      ...prev,
      scanResults: [fakeQR, ...prev.scanResults.slice(0,9)]
    }));

    // Cria job fictício via galeria
    uberEngine.createJob({
      title: 'Serviço enviado pela galeria',
      value: 140.00,
      category: 'manutencao',
      qrId: fakeQR.id
    });
  }
};
