/* =========================================================
   VERDEX APP STYLES — GOD MODE
   ========================================================= */

body, html, #root, .app-container {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #047857, #065f46, #064e3b);
  color: white;
}

button {
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
}

button:active {
  transform: scale(0.97);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 16px;
  border: 2px solid #10b981;
}

.card h4 {
  margin: 0 0 8px 0;
}

.gradient-text {
  background: linear-gradient(45deg, #10b981, #34d399, #6ee7b7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fixed-action-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  font-size: 28px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-nav {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  gap: 16px;
  z-index: 100;
}

/* =========================================================
   ANIMAÇÕES — SCANNER & BOTÕES
   ========================================================= */
@keyframes scanPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
