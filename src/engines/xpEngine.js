/* =========================================================
   VERDEX XP ENGINE — GOD MODE
   Gerenciamento de XP, Coins, Levels, Streaks e Notificações
   ========================================================= */

const XP_ENGINE = (initialState = {}) => {
  // Estado inicial do jogador
  let state = {
    xp: 0,
    coins: 0,
    level: 1,
    streak: 0,
    badges: [],
    notifications: [],
    ...initialState
  };

  // Configurações do leveling
  const LEVEL_XP_BASE = 500; // XP necessário para subir de nível
  const STREAK_BONUS = 50;   // XP extra por streak diário

  /* =========================================================
     FUNÇÕES PRINCIPAIS
     ========================================================= */

  // Adiciona XP
  const addXP = (amount, source = "genérico") => {
    state.xp += amount;

    // Calcula novo level
    const newLevel = Math.floor(state.xp / LEVEL_XP_BASE) + 1;
    if (newLevel > state.level) {
      state.level = newLevel;
      addNotification(`🔥 Parabéns! Subiu para Level ${newLevel}`, "level");
      addBadge(`Level ${newLevel}`);
    }

    addNotification(`+${amount} XP (${source})`, "xp");
    return state;
  };

  // Adiciona moedas
  const addCoins = (amount, source = "genérico") => {
    state.coins += amount;
    addNotification(`💰 +${amount} Coins (${source})`, "coins");
    return state;
  };

  // Incrementa streak diário
  const addStreak = () => {
    state.streak += 1;
    addNotification(`🔥 Streak atual: ${state.streak}`, "streak");
    addXP(STREAK_BONUS, "streak");
    return state;
  };

  // Reseta streak (quando usuário quebra streak)
  const resetStreak = () => {
    state.streak = 0;
    addNotification("⚠️ Streak resetado!", "streak");
    return state;
  };

  // Adiciona badge
  const addBadge = (badgeName) => {
    if (!state.badges.includes(badgeName)) state.badges.push(badgeName);
    return state;
  };

  // Cria notificação
  const addNotification = (message, type = "info") => {
    const notif = { id: Date.now(), message, type };
    state.notifications = [...state.notifications.slice(-9), notif];
    return notif;
  };

  /* =========================================================
     GETTERS
     ========================================================= */
  const getState = () => ({ ...state });
  const getNotifications = () => [...state.notifications];
  const getBadges = () => [...state.badges];

  /* =========================================================
     EXPORTANDO FUNÇÕES
     ========================================================= */
  return {
    addXP,
    addCoins,
    addStreak,
    resetStreak,
    addBadge,
    getState,
    getNotifications,
    getBadges
  };
};

export default XP_ENGINE;
