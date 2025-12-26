import React from "react";

/**
 * BottomNav – VERDEX
 * Componente de navegação inferior premium
 * Mobile-first | UX clean | Escalável
 */

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: "scan", label: "Scanner", icon: "🌿" },
    { id: "result", label: "Resultado", icon: "🧠" },
    { id: "progress", label: "Progresso", icon: "📈" },
    { id: "collection", label: "Coleção", icon: "📚" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];

  return (
    <nav style={styles.nav}>
      {items.map((item) => {
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...styles.button,
              ...(isActive ? styles.active : {}),
            }}
          >
            <div style={styles.icon}>{item.icon}</div>
            <span
              style={{
                ...styles.label,
                opacity: isActive ? 1 : 0.65,
              }}
            >
              {item.label}
            </span>

            {isActive && <div style={styles.activeIndicator} />}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

/* =======================
   STYLES (INLINE PREMIUM)
======================= */

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "78px",
    background: "rgba(6, 78, 59, 0.92)",
    backdropFilter: "blur(18px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    zIndex: 999,
  },

  button: {
    flex: 1,
    height: "100%",
    background: "transparent",
    border: "none",
    color: "#e5f5ee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    position: "relative",
    transition: "all 0.25s ease",
  },

  icon: {
    fontSize: "22px",
    lineHeight: 1,
    filter: "drop-shadow(0 0 6px rgba(16,185,129,0.4))",
  },

  label: {
    fontSize: "11px",
    letterSpacing: "0.4px",
    transition: "opacity 0.2s ease",
  },

  active: {
    color: "#10b981",
    transform: "translateY(-2px)",
  },

  activeIndicator: {
    position: "absolute",
    top: 6,
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#10b981",
    boxShadow: "0 0 10px #10b981",
  },
};
