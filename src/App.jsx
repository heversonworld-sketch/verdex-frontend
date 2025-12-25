import { useState } from 'react'

function App() {
  const [result, setResult] = useState(null)
  
  const scanPlant = async () => {
    // CAMERA + PLANTNET API aqui
    setResult("Hibiscus 87% +10 XP!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">🌿 VERDEX</h1>
      <button 
        onClick={scanPlant}
        className="bg-white text-green-600 px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105"
      >
        📱 Escanear Planta
      </button>
      {result && <p className="mt-8 text-2xl text-white">{result}</p>}
    </div>
  )
}

export default App
