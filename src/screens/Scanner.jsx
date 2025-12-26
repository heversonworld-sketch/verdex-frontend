import { useRef } from "react";
import ScannerOverlay from "../components/ScannerOverlay";

export default function Scanner() {
  const fileInputRef = useRef(null);

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="scanner-screen">
      <video className="camera-preview" autoPlay playsInline muted />

      <ScannerOverlay onGallery={openGallery} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
