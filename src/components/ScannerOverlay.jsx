export default function ScannerOverlay({ onGallery }) {
  return (
    <div className="scanner-overlay">
      <button className="btn-secondary" onClick={onGallery}>
        📁 Galeria
      </button>

      <button className="btn-primary">
        📸 Escanear
      </button>
    </div>
  );
}
