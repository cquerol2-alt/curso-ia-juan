/* ============================================
   SISTEMA DE PROGRESO — Curso IA Juan Querol
   XP, Niveles, Badges, Streak, Combos, Cofre
   ============================================ */

const CourseProgress = (() => {
  // --- Configuración ---
  const STORAGE_KEY = 'curso-ia-juan-progress';
  const SYNC_TOKEN_KEY = 'curso-ia-juan-sync-token';
  const GITHUB_REPO = 'cquerol2-alt/curso-ia-juan';
  const PROGRESS_FILE = 'progress-data.json';
  let _syncTimeout = null;

  const XP_PER_CLASS = 10;
  const XP_BONUS_HIGH_SCORE = 5;  // si test >= 9/10
  const XP_PER_BOSS_BATTLE = 50;
  const XP_PER_RETO = 20;
  const PASS_THRESHOLD = 7; // nota mínima para aprobar test (de 10)

  // --- Sistema de Niveles ---
  // XP acumulada necesaria para cada nivel
  // Nivel 1 = 0 XP, Nivel 2 = 30 XP, Nivel 3 = 90 XP...
  // Fórmula: XP(n) = 15 * n * (n - 1)
  const LEVEL_TITLES = [
    '', // placeholder nivel 0
    'Novato',          // 1
    'Aprendiz',        // 2
    'Iniciado',        // 3
    'Estudiante',      // 4
    'Aventurero',      // 5
    'Guerrero del Código', // 6
    'Hechicero Digital',   // 7
    'Maestro IA',      // 8
    'Leyenda',         // 9
    'Ascendido',       // 10
  ];

  function xpForLevel(n) {
    return 15 * n * (n - 1);
  }

  function getLevel(xp) {
    let level = 1;
    while (xpForLevel(level + 1) <= xp && level < LEVEL_TITLES.length - 1) {
      level++;
    }
    return level;
  }

  function getLevelInfo(xp) {
    const level = getLevel(xp);
    const currentLevelXP = xpForLevel(level);
    const nextLevelXP = xpForLevel(level + 1);
    const xpInLevel = xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    return {
      level,
      title: LEVEL_TITLES[level] || 'Ascendido',
      xpInLevel,
      xpNeeded,
      percent: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)),
      totalXP: xp,
    };
  }

  // --- Sistema de Recompensas Intermitentes ---
  // 70% base de obtener recompensa, 30% nada
  // Recompensas personalizadas para Juan: vídeos, magia, comida
  const REWARD_CHANCE_BASE = 0.70;

  const REWARDS = {
    common: {
      chance: 0.50, // 50% de las recompensas
      color: '#aaaaaa',
      label: 'Común',
      icon: '🪙',
      items: [
        { text: '15 min de vídeos de YouTube', icon: '📺' },
        { text: 'Un snack a tu elección', icon: '🍪' },
        { text: '10 min de descanso extra', icon: '☕' },
        { text: 'Elige la canción que suena ahora', icon: '🎵' },
      ],
    },
    uncommon: {
      chance: 0.30, // 30%
      color: '#39ff14',
      label: 'Poco común',
      icon: '💚',
      items: [
        { text: '30 min de vídeos o series', icon: '🎬' },
        { text: 'Elige la merienda de hoy', icon: '🍕' },
        { text: 'Partida rápida de lo que quieras', icon: '🎮' },
        { text: '20 min de scroll libre sin culpa', icon: '📱' },
      ],
    },
    rare: {
      chance: 0.15, // 15%
      color: '#00f0ff',
      label: 'Raro',
      icon: '💎',
      items: [
        { text: '1 hora de vídeos/gaming', icon: '🕹️' },
        { text: 'Elige la cena de hoy', icon: '🍽️' },
        { text: 'Tarde libre de estudio mañana', icon: '🏖️' },
        { text: 'Sesión de magia (clase o práctica)', icon: '🎩' },
      ],
    },
    epic: {
      chance: 0.04, // 4%
      color: '#ff00e5',
      label: 'Épico',
      icon: '🔮',
      items: [
        { text: 'Cena fuera donde tú elijas', icon: '🍣' },
        { text: 'Compra un truco de magia nuevo', icon: '✨' },
        { text: 'Entrada a parque de atracciones', icon: '🎢' },
      ],
    },
    legendary: {
      chance: 0.01, // 1%
      color: '#ffd700',
      label: '¡¡LEGENDARIO!!',
      icon: '👑',
      items: [
        { text: 'Espectáculo de magia en vivo', icon: '🎪' },
        { text: 'Día libre total + plan especial', icon: '🌟' },
        { text: 'Día en parque de atracciones', icon: '🎡' },
      ],
    },
  };

  // --- Combos de sesión ---
  const SESSION_KEY = 'curso-ia-juan-session';
  const SESSION_TIMEOUT = 90 * 60 * 1000; // 90 min = misma sesión

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Date.now() - s.lastActivity < SESSION_TIMEOUT) return s;
      }
    } catch (e) { /* ignore */ }
    return { classesThisSession: 0, lastActivity: Date.now(), comboXPEarned: 0 };
  }

  function updateSession() {
    const session = getSession();
    session.classesThisSession += 1;
    session.lastActivity = Date.now();
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) { /* ignore */ }
    return session;
  }

  function getComboBonus(classesInSession) {
    // 2 clases seguidas = +5 XP, 3 = +10 XP, 4+ = +20 XP
    if (classesInSession >= 4) return { xp: 20, label: 'COMBO x4+! 🔥🔥🔥🔥', tier: 4 };
    if (classesInSession >= 3) return { xp: 10, label: 'COMBO x3! 🔥🔥🔥', tier: 3 };
    if (classesInSession >= 2) return { xp: 5, label: 'COMBO x2! 🔥🔥', tier: 2 };
    return null;
  }

  const BADGES = {
    'python-initiate': { name: 'Python Initiate', icon: '🐍', module: 1, description: 'Completa el Módulo 1: Python para Devs Web' },
    'api-master': { name: 'API Master', icon: '🔌', module: 3, description: 'Completa el Módulo 3: APIs de IA' },
    'ai-augmented': { name: 'AI-Augmented Dev', icon: '🤖', module: 4, description: 'Completa el Módulo 4: AI Coding Tools' },
    'rag-wizard': { name: 'Context Engineer', icon: '🧩', module: 5, description: 'Completa el Módulo 5: Context, Search & RAG' },
    'agent-builder': { name: 'Agent Builder', icon: '🏗️', module: 6, description: 'Completa el Módulo 6: Agentes de IA' },
    'fullstack-ai': { name: 'Full-Stack AI Dev', icon: '🚀', module: 7, description: 'Completa el Módulo 7: Full-Stack AI App' },
    'portfolio-pro': { name: 'Portfolio Pro', icon: '💼', module: 8, description: 'Completa el Módulo 8: Portfolio y CV' },
    'job-hunter': { name: 'Job Hunter', icon: '🎯', module: 9, description: 'Completa el Módulo 9: Búsqueda Activa de Empleo' },
    'first-blood': { name: 'First Blood', icon: '🩸', module: null, description: 'Completa tu primera clase' },
    'streak-7': { name: 'En Racha ×7', icon: '🔥', module: null, description: '7 días consecutivos estudiando' },
    'perfect-score': { name: 'Nota Perfecta', icon: '💯', module: null, description: 'Saca 10/10 en un test' },
    'combo-master': { name: 'Combo Master', icon: '⚡', module: null, description: 'Haz 4+ clases en una sesión' },
    'lucky-strike': { name: 'Lucky Strike', icon: '🍀', module: null, description: 'Consigue una recompensa Épica o Legendaria' },
    'streak-30': { name: 'Racha Imparable', icon: '🌋', module: null, description: '30 días consecutivos estudiando' },
    'first-submit': { name: 'Primera Entrega', icon: '📤', module: null, description: 'Entrega tu primer ejercicio' },
  };

  const MODULES = {
    1: { name: 'Python para Devs Web', totalClasses: 10, weeks: '1-2' },
    2: { name: 'Fundamentos de IA y LLMs', totalClasses: 5, weeks: '3' },
    3: { name: 'APIs de IA — Tu Primer Chatbot', totalClasses: 7, weeks: '4-5' },
    4: { name: 'AI Coding Tools', totalClasses: 5, weeks: '5' },
    5: { name: 'Context, Search & RAG', totalClasses: 10, weeks: '6-7' },
    6: { name: 'Agentes de IA', totalClasses: 6, weeks: '8-9' },
    7: { name: 'Full-Stack AI App', totalClasses: 7, weeks: '10-11' },
    8: { name: 'Portfolio, CV y Job-Ready', totalClasses: 5, weeks: '11' },
    9: { name: 'Búsqueda Activa de Empleo', totalClasses: 5, weeks: '12' },
  };

  // --- Estado por defecto ---
  function getDefaultState() {
    return {
      xp: 0,
      badges: [],
      completedClasses: [],   // ["m1-c01", "m1-c02", ...]
      testScores: {},          // {"m1-c01": 8, "m1-c02": 10, ...}
      streak: 0,
      lastStudyDate: null,
      startDate: null,
      rewardsLog: [],          // [{date, tier, text, icon}]
      totalRewardsEarned: 0,
      highestCombo: 0,
    };
  }

  // --- Persistencia ---
  function load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return { ...getDefaultState(), ...JSON.parse(data) };
    } catch (e) {
      console.warn('Error cargando progreso:', e);
    }
    return getDefaultState();
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error guardando progreso:', e.name);
      if (e.name === 'QuotaExceededError') {
        alert('⚠️ Espacio de almacenamiento agotado. Tu progreso no se guardó localmente. Contacta a Cristina.');
      }
    }
    // Intentar sync aunque localStorage falle (si hay token)
    _debouncedSync();
  }

  // --- Streak ---
  function updateStreak(state) {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastStudyDate === today) return state;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (state.lastStudyDate === yesterday) {
      state.streak += 1;
    } else if (state.lastStudyDate !== today) {
      state.streak = 1;
    }
    state.lastStudyDate = today;
    if (!state.startDate) state.startDate = today;

    // Badges racha
    if (state.streak >= 7 && !state.badges.includes('streak-7')) {
      state.badges.push('streak-7');
    }
    if (state.streak >= 30 && !state.badges.includes('streak-30')) {
      state.badges.push('streak-30');
    }
    return state;
  }

  // --- Roll de recompensa ---
  function rollReward(state) {
    // Chance base 70% + bonus por streak (+1% por día, max +10%)
    const streakBonus = Math.min(0.10, state.streak * 0.01);
    const totalChance = REWARD_CHANCE_BASE + streakBonus;

    if (Math.random() > totalChance) {
      return null; // Sin recompensa esta vez
    }

    // Determinar tier
    const roll = Math.random();
    let cumulative = 0;
    const tiers = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
    let selectedTier = 'common';

    for (const tier of tiers) {
      cumulative += REWARDS[tier].chance;
      if (roll <= cumulative) {
        selectedTier = tier;
        break;
      }
    }

    const tierData = REWARDS[selectedTier];
    const item = tierData.items[Math.floor(Math.random() * tierData.items.length)];

    return {
      tier: selectedTier,
      label: tierData.label,
      color: tierData.color,
      tierIcon: tierData.icon,
      text: item.text,
      icon: item.icon,
    };
  }

  // --- Completar clase ---
  function completeClass(classId, testScore = null) {
    let state = load();
    const prevXP = state.xp;
    const prevLevel = getLevel(prevXP);
    state = updateStreak(state);

    let xpGained = 0;
    let isNewClass = false;

    if (!state.completedClasses.includes(classId)) {
      state.completedClasses.push(classId);
      isNewClass = true;

      // XP por clase
      const isBossBattle = classId.endsWith('-bb');
      const classXP = isBossBattle ? XP_PER_BOSS_BATTLE : XP_PER_CLASS;
      state.xp += classXP;
      xpGained += classXP;

      // First blood
      if (state.completedClasses.length === 1 && !state.badges.includes('first-blood')) {
        state.badges.push('first-blood');
      }
    }

    // Test score
    if (testScore !== null) {
      state.testScores[classId] = testScore;
      if (testScore >= 9) {
        state.xp += XP_BONUS_HIGH_SCORE;
        xpGained += XP_BONUS_HIGH_SCORE;
      }
      if (testScore === 10 && !state.badges.includes('perfect-score')) {
        state.badges.push('perfect-score');
      }
    }

    // Combo de sesión
    const session = updateSession();
    const combo = getComboBonus(session.classesThisSession);
    if (combo) {
      state.xp += combo.xp;
      xpGained += combo.xp;
      if (session.classesThisSession > (state.highestCombo || 0)) {
        state.highestCombo = session.classesThisSession;
      }
      if (session.classesThisSession >= 4 && !state.badges.includes('combo-master')) {
        state.badges.push('combo-master');
      }
    }

    // Check module completion for badges
    checkModuleBadges(state);

    // Roll reward
    const reward = isNewClass ? rollReward(state) : null;
    if (reward) {
      state.totalRewardsEarned = (state.totalRewardsEarned || 0) + 1;
      if (!state.rewardsLog) state.rewardsLog = [];
      state.rewardsLog.push({
        date: new Date().toISOString(),
        tier: reward.tier,
        text: reward.text,
        icon: reward.icon,
      });
      // Lucky Strike badge
      if ((reward.tier === 'epic' || reward.tier === 'legendary') && !state.badges.includes('lucky-strike')) {
        state.badges.push('lucky-strike');
      }
    }

    // Level up check
    const newLevel = getLevel(state.xp);
    const leveledUp = newLevel > prevLevel;

    save(state);

    return {
      state,
      xpGained,
      combo,
      reward,
      leveledUp,
      newLevel,
      levelInfo: getLevelInfo(state.xp),
    };
  }

  function checkModuleBadges(state) {
    const moduleBadgeMap = {
      1: 'python-initiate',
      3: 'api-master',
      4: 'ai-augmented',
      5: 'rag-wizard',
      6: 'agent-builder',
      7: 'fullstack-ai',
      8: 'portfolio-pro',
      9: 'job-hunter',
    };
    for (const [modNum, badgeId] of Object.entries(moduleBadgeMap)) {
      const mod = MODULES[modNum];
      if (!mod) continue;
      const prefix = `m${modNum}-`;
      const completed = state.completedClasses.filter(c => c.startsWith(prefix)).length;
      if (completed >= mod.totalClasses && !state.badges.includes(badgeId)) {
        state.badges.push(badgeId);
      }
    }
  }

  // --- Getters ---
  function getState() { return load(); }

  function getModuleProgress(moduleNum) {
    const state = load();
    const prefix = `m${moduleNum}-`;
    const completedIds = state.completedClasses.filter(c => c.startsWith(prefix));
    const completed = completedIds.length;
    const total = MODULES[moduleNum]?.totalClasses || 0;
    let xp = completed * XP_PER_CLASS;
    completedIds.forEach(id => {
      const score = state.testScores[id];
      if (score !== undefined && score >= 9) xp += XP_BONUS_HIGH_SCORE;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0, xp };
  }

  function getTotalProgress() {
    const state = load();
    const totalClasses = Object.values(MODULES).reduce((sum, m) => sum + m.totalClasses, 0);
    const completed = state.completedClasses.length;
    return { completed, total: totalClasses, percent: totalClasses > 0 ? Math.round((completed / totalClasses) * 100) : 0 };
  }

  function isClassCompleted(classId) {
    return load().completedClasses.includes(classId);
  }

  function getTestScore(classId) {
    return load().testScores[classId] ?? null;
  }

  // ============================================
  //  CHEST UI — Cofre de recompensa post-quiz
  // ============================================

  function _createChestOverlay() {
    // Remove existing
    const existing = document.getElementById('reward-chest-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'reward-chest-overlay';
    overlay.className = 'chest-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }

  function showRewardSequence(result) {
    const { xpGained, combo, reward, leveledUp, newLevel, levelInfo } = result;
    const overlay = _createChestOverlay();

    // Build content
    let html = '<div class="chest-modal">';

    // XP earned summary
    html += '<div class="chest-xp-summary">';
    html += `<div class="chest-xp-number">+${xpGained} XP</div>`;
    if (combo) {
      html += `<div class="chest-combo">${combo.label} (+${combo.xp} XP bonus)</div>`;
    }
    html += '</div>';

    // Level up?
    if (leveledUp) {
      html += '<div class="chest-levelup">';
      html += '<div class="chest-levelup-text">⚡ LEVEL UP ⚡</div>';
      html += `<div class="chest-levelup-level">Nivel ${newLevel}: ${levelInfo.title}</div>`;
      html += '</div>';
    }

    // Chest
    html += '<div class="chest-container">';
    if (reward) {
      html += `<div class="chest-icon chest-glow" style="--chest-color: ${reward.color}">🎁</div>`;
      html += `<div class="chest-tier" style="color: ${reward.color}">${reward.tierIcon} ${reward.label}</div>`;
      html += `<div class="chest-reward-text">`;
      html += `<span class="chest-reward-icon">${reward.icon}</span>`;
      html += `<span>${reward.text}</span>`;
      html += `</div>`;
      html += `<div class="chest-claim-hint">¡Has ganado una recompensa!</div>`;
    } else {
      html += '<div class="chest-icon chest-empty">📦</div>';
      html += '<div class="chest-no-reward">Los dados no cayeron a tu favor...</div>';
      html += '<div class="chest-no-reward-sub">Pero tu XP es para siempre. ¡Sigue adelante!</div>';
    }
    html += '</div>';

    // Close button
    html += '<button class="chest-close-btn" onclick="document.getElementById(\'reward-chest-overlay\').classList.add(\'chest-closing\'); setTimeout(() => document.getElementById(\'reward-chest-overlay\')?.remove(), 300);">Continuar</button>';
    html += '</div>';

    overlay.innerHTML = html;

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('chest-visible');
    });
  }

  // --- Quiz Engine ---
  function initQuiz(containerId, questions, classId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    questions.forEach((q, i) => {
      html += `<div class="quiz-question" data-question="${i}" data-correct="${q.correct}">
        <p>${i + 1}. ${q.question}</p>`;
      q.options.forEach((opt, j) => {
        html += `<label>
          <input type="radio" name="q${i}" value="${j}"> ${opt}
        </label>`;
      });
      html += `</div>`;
    });

    html += `<div style="text-align:center; margin-top:1.5em;">
      <button class="btn btn-green" onclick="CourseProgress.submitQuiz('${containerId}', '${classId}')">
        Comprobar respuestas
      </button>
    </div>`;

    html += `<div id="${containerId}-score" class="score-display"></div>`;
    container.innerHTML = html;
  }

  function submitQuiz(containerId, classId) {
    const container = document.getElementById(containerId);
    const questionEls = container.querySelectorAll('.quiz-question');
    let correct = 0;
    const total = questionEls.length;

    questionEls.forEach(qEl => {
      const correctAnswer = parseInt(qEl.dataset.correct);
      const selected = qEl.querySelector('input:checked');
      const labels = qEl.querySelectorAll('label');

      labels.forEach(l => l.classList.remove('correct', 'incorrect'));

      if (selected) {
        const selectedVal = parseInt(selected.value);
        if (selectedVal === correctAnswer) {
          correct++;
          labels[selectedVal].classList.add('correct');
        } else {
          labels[selectedVal].classList.add('incorrect');
          labels[correctAnswer].classList.add('correct');
        }
      } else {
        labels[correctAnswer].classList.add('correct');
      }

      qEl.querySelectorAll('input').forEach(inp => inp.disabled = true);
    });

    const score = Math.round((correct / total) * 10);
    const passed = score >= PASS_THRESHOLD;

    const scoreEl = document.getElementById(`${containerId}-score`);
    scoreEl.className = `score-display show ${passed ? 'score-pass' : 'score-fail'}`;
    scoreEl.innerHTML = `
      <div class="score-number">${score}/10</div>
      <p style="margin-top:0.5em; font-size:1.1em;">
        ${passed
          ? '¡Aprobado! 🎉 +' + XP_PER_CLASS + ' XP' + (score >= 9 ? ' +' + XP_BONUS_HIGH_SCORE + ' XP bonus' : '')
          : 'No has llegado al 7/10. ¡Repasa e inténtalo de nuevo!'}
      </p>
      ${passed ? '' : '<button class="btn" style="margin-top:1em;" onclick="location.reload()">Reintentar</button>'}
    `;

    if (passed) {
      const result = completeClass(classId, score);
      // Disable submit button
      container.querySelector('.btn-green').disabled = true;
      container.querySelector('.btn-green').style.opacity = '0.5';
      // Show reward chest after a brief delay
      setTimeout(() => showRewardSequence(result), 800);
    }
  }

  // --- Render helpers ---
  function renderXPBar(containerId, currentXP, maxXP) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const info = getLevelInfo(currentXP || load().xp);
    const percent = info.percent;
    el.innerHTML = `
      <div class="level-indicator">
        <span class="level-badge">Nv. ${info.level}</span>
        <span class="level-title">${info.title}</span>
      </div>
      <div class="xp-bar-container">
        <div class="xp-bar" style="width:${percent}%"></div>
        <span class="xp-label">${info.xpInLevel} / ${info.xpNeeded} XP → Nv. ${info.level + 1}</span>
      </div>
      <div style="text-align:center; margin-top:0.3em; font-size:0.75em; color:var(--text-muted);">
        XP Total: ${info.totalXP}
      </div>`;
  }

  function renderBadges(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const state = load();
    let html = '';
    for (const [id, badge] of Object.entries(BADGES)) {
      const unlocked = state.badges.includes(id);
      html += `<span class="badge ${unlocked ? 'badge-unlocked' : 'badge-locked'}" title="${badge.description}">
        ${badge.icon} ${badge.name}
      </span> `;
    }
    el.innerHTML = html;
  }

  function renderStreak(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const state = load();
    const streakClass = state.streak >= 7 ? 'streak-hot' : '';
    el.innerHTML = `<span class="streak ${streakClass}">🔥 ${state.streak} día${state.streak !== 1 ? 's' : ''}</span>`;
    if (state.streak >= 3) {
      const bonus = Math.min(10, state.streak);
      el.innerHTML += `<span class="streak-bonus">+${bonus}% prob. recompensa</span>`;
    }
  }

  // --- Reset (solo para debug) ---
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    console.log('Progreso reseteado');
  }

  // --- GitHub Sync ---
  function _setupSync(token) {
    try { localStorage.setItem(SYNC_TOKEN_KEY, token); } catch (e) { /* ignore */ }
  }

  function _getSyncToken() {
    try { return localStorage.getItem(SYNC_TOKEN_KEY); } catch (e) { return null; }
  }

  async function syncToGitHub() {
    const token = _getSyncToken();
    if (!token) return;

    const state = load();
    const payload = {
      lastSync: new Date().toISOString(),
      student: 'Juan Querol León',
      xp: state.xp,
      level: getLevel(state.xp),
      levelTitle: getLevelInfo(state.xp).title,
      badges: state.badges,
      completedClasses: state.completedClasses,
      testScores: state.testScores,
      streak: state.streak,
      lastStudyDate: state.lastStudyDate,
      startDate: state.startDate,
      totalRewardsEarned: state.totalRewardsEarned || 0,
      highestCombo: state.highestCombo || 0,
      skillProfile: getSkillProfile(),
    };

    try {
      let sha = null;
      const getRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${PROGRESS_FILE}?ref=main`,
        { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' } }
      );
      if (getRes.ok) {
        sha = (await getRes.json()).sha;
      }

      const body = {
        message: `sync: Nv.${payload.level} ${payload.levelTitle} | ${state.completedClasses.length} clases, ${state.xp} XP`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))),
        branch: 'main',
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${PROGRESS_FILE}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
          },
          body: JSON.stringify(body),
        }
      );
      if (putRes.ok) console.log('Progreso sincronizado con GitHub');
      else console.warn('Error sync GitHub:', putRes.status);
    } catch (e) {
      console.warn('Error sincronizando progreso:', e);
    }
  }

  function _debouncedSync() {
    if (_syncTimeout) clearTimeout(_syncTimeout);
    _syncTimeout = setTimeout(syncToGitHub, 3000);
  }

  // --- Sync bidireccional: descarga + merge ---
  async function pullFromGitHub() {
    const token = _getSyncToken();
    if (!token) return;

    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${PROGRESS_FILE}?ref=main&t=${Date.now()}`,
        { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' } }
      );
      if (!res.ok) return; // no remote data yet, skip

      const file = await res.json();
      const decoded = decodeURIComponent(escape(atob(file.content)));
      const remote = JSON.parse(decoded);

      // Merge remote into local
      const local = load();
      const merged = mergeStates(local, remote);

      // Only save if something changed
      if (JSON.stringify(merged) !== JSON.stringify(local)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) { /* ignore */ }
        console.log('Progreso sincronizado desde GitHub (merge completado)');
      }
    } catch (e) {
      console.warn('Error descargando progreso desde GitHub:', e);
    }
  }

  function mergeStates(local, remote) {
    const merged = { ...getDefaultState() };

    // completedClasses: unión de ambos (sin duplicados)
    const allClasses = new Set([
      ...(local.completedClasses || []),
      ...(remote.completedClasses || []),
    ]);
    merged.completedClasses = [...allClasses];

    // testScores: quedarse con la mejor nota de cada clase
    merged.testScores = { ...(remote.testScores || {}) };
    for (const [id, score] of Object.entries(local.testScores || {})) {
      if (!merged.testScores[id] || score > merged.testScores[id]) {
        merged.testScores[id] = score;
      }
    }

    // badges: unión de ambos
    const allBadges = new Set([
      ...(local.badges || []),
      ...(remote.badges || []),
    ]);
    merged.badges = [...allBadges];

    // XP: recalcular desde los datos fusionados (evita XP inflada)
    let xp = 0;
    merged.completedClasses.forEach(classId => {
      const isBoss = classId.endsWith('-bb');
      xp += isBoss ? XP_PER_BOSS_BATTLE : XP_PER_CLASS;
      const score = merged.testScores[classId];
      if (score !== undefined && score >= 9) xp += XP_BONUS_HIGH_SCORE;
    });
    // Añadir XP extra que pueda venir de combos (usar el mayor)
    const localComboXP = (local.xp || 0) - _calcBaseXP(local);
    const remoteComboXP = (remote.xp || 0) - _calcBaseXP(remote);
    xp += Math.max(0, localComboXP, remoteComboXP);
    merged.xp = xp;

    // streak: el mayor
    merged.streak = Math.max(local.streak || 0, remote.streak || 0);

    // lastStudyDate: la más reciente
    merged.lastStudyDate = [local.lastStudyDate, remote.lastStudyDate]
      .filter(Boolean).sort().pop() || null;

    // startDate: la más antigua
    merged.startDate = [local.startDate, remote.startDate]
      .filter(Boolean).sort().shift() || null;

    // rewardsLog: unión por timestamp (sin duplicados cercanos)
    const localRewards = local.rewardsLog || [];
    const remoteRewards = remote.rewardsLog || [];
    const seenDates = new Set();
    merged.rewardsLog = [];
    for (const r of [...localRewards, ...remoteRewards]) {
      const key = r.date + r.text;
      if (!seenDates.has(key)) {
        seenDates.add(key);
        merged.rewardsLog.push(r);
      }
    }
    merged.rewardsLog.sort((a, b) => a.date.localeCompare(b.date));

    // totalRewardsEarned: el real del log fusionado
    merged.totalRewardsEarned = merged.rewardsLog.length;

    // highestCombo: el mayor
    merged.highestCombo = Math.max(local.highestCombo || 0, remote.highestCombo || 0);

    // Recalcular level y levelTitle desde XP fusionada
    const levelInfo = getLevelInfo(merged.xp);
    merged.level = levelInfo.level;
    merged.levelTitle = levelInfo.title;

    // Re-check module badges con datos fusionados
    checkModuleBadges(merged);

    return merged;
  }

  // Helper: calcula XP base sin combos
  function _calcBaseXP(state) {
    let xp = 0;
    (state.completedClasses || []).forEach(classId => {
      xp += classId.endsWith('-bb') ? XP_PER_BOSS_BATTLE : XP_PER_CLASS;
      const score = (state.testScores || {})[classId];
      if (score !== undefined && score >= 9) xp += XP_BONUS_HIGH_SCORE;
    });
    return xp;
  }

  function checkSyncSetup() {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('sync-setup');
      // Validar formato PAT de GitHub antes de guardar
      if (token && /^(ghp_|github_pat_)[A-Za-z0-9_]{36,255}$/.test(token)) {
        _setupSync(token);
        params.delete('sync-setup');
        const clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', clean);
        console.log('Sync activado — el progreso se guardará en GitHub automáticamente');
      } else if (token) {
        console.warn('Token de sincronización inválido (descartado)');
      }
    } catch (e) { /* ignore */ }

    // Siempre intentar pull al cargar (si sync está activado)
    if (_getSyncToken()) {
      pullFromGitHub().then(() => {
        // Tras el pull, subir por si el merge generó cambios
        syncToGitHub();
      });
    }
  }

  function isSyncEnabled() {
    return !!_getSyncToken();
  }

  // --- Perfil de Conocimiento (Skill Radar) ---
  // Mapea módulos a áreas de habilidad y calcula dominio 0-100
  const SKILL_AREAS = {
    'Python':       { modules: [1], icon: '🐍', color: '#39ff14' },
    'IA / LLMs':    { modules: [2], icon: '🧠', color: '#00f0ff' },
    'APIs':         { modules: [3], icon: '🔌', color: '#ff00e5' },
    'AI Tools':     { modules: [4], icon: '🤖', color: '#ffe600' },
    'Context & RAG':{ modules: [5], icon: '🧩', color: '#ff6b00' },
    'Agentes':      { modules: [6], icon: '🏗️', color: '#00ff88' },
    'Full-Stack':   { modules: [7], icon: '🚀', color: '#ff4488' },
    'Portfolio':    { modules: [8, 9], icon: '💼', color: '#aa88ff' },
  };

  function getSkillProfile() {
    const state = load();
    const profile = {};

    for (const [skill, cfg] of Object.entries(SKILL_AREAS)) {
      let totalClasses = 0;
      let completedCount = 0;
      let scoreSum = 0;
      let scoreCount = 0;

      for (const modNum of cfg.modules) {
        const mod = MODULES[modNum];
        if (!mod) continue;
        totalClasses += mod.totalClasses;
        const prefix = `m${modNum}-`;
        const done = state.completedClasses.filter(c => c.startsWith(prefix));
        completedCount += done.length;
        done.forEach(classId => {
          const s = state.testScores[classId];
          if (s !== undefined) {
            scoreSum += s;
            scoreCount++;
          }
        });
      }

      // Dominio = 60% avance + 40% nota media (sobre 10 → sobre 100)
      const progressPct = totalClasses > 0 ? (completedCount / totalClasses) : 0;
      const avgScore = scoreCount > 0 ? (scoreSum / scoreCount) / 10 : 0;
      const mastery = Math.round((progressPct * 0.6 + avgScore * 0.4) * 100);

      profile[skill] = {
        mastery,               // 0-100
        completed: completedCount,
        total: totalClasses,
        avgScore: scoreCount > 0 ? Math.round((scoreSum / scoreCount) * 10) / 10 : null,
        icon: cfg.icon,
        color: cfg.color,
      };
    }
    return profile;
  }

  // --- Tool Checklist System ---
  const TOOL_STORAGE_KEY = 'curso-ia-juan-tools';

  function getToolState() {
    try { return JSON.parse(localStorage.getItem(TOOL_STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveToolState(state) {
    try {
      localStorage.setItem(TOOL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error guardando estado de herramientas:', e.name);
    }
  }

  function initToolChecklist(moduleNum) {
    const tables = document.querySelectorAll('table');
    // Find the tool table (first table in "Antes de empezar" section)
    let toolTable = null;
    for (const t of tables) {
      const th = t.querySelector('thead th');
      if (th && th.textContent.trim().toLowerCase().includes('herramienta')) {
        toolTable = t;
        break;
      }
    }
    if (!toolTable) return;

    const state = getToolState();
    const modKey = `m${moduleNum}`;
    if (!state[modKey]) state[modKey] = {};

    // Add header checkbox column
    const headerRow = toolTable.querySelector('thead tr');
    const checkTh = document.createElement('th');
    checkTh.textContent = '✓';
    checkTh.style.cssText = 'width: 50px; text-align: center;';
    headerRow.insertBefore(checkTh, headerRow.firstChild);

    // Add checkboxes to each row
    const rows = toolTable.querySelectorAll('tbody tr');
    let checkedCount = 0;
    rows.forEach((row, idx) => {
      const toolNameEl = row.querySelector('td strong');
      const displayName = toolNameEl ? toolNameEl.textContent.trim() : `Herramienta ${idx + 1}`;
      const key = displayName.replace(/\s+/g, '-').toLowerCase();
      // Migrate old boolean format or read new format
      const toolData = state[modKey][key];
      const isChecked = typeof toolData === 'object' ? !!toolData.checked : !!toolData;
      if (isChecked) checkedCount++;

      // Always save with name (ensures migration from old format)
      state[modKey][key] = { checked: isChecked, name: displayName };

      const td = document.createElement('td');
      td.style.cssText = 'text-align: center; vertical-align: middle;';
      td.innerHTML = `<label style="cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0;">
        <input type="checkbox" data-tool-key="${key}" ${isChecked ? 'checked' : ''}
          style="width:20px;height:20px;accent-color:#00e676;cursor:pointer;">
      </label>`;
      row.insertBefore(td, row.firstChild);

      td.querySelector('input').addEventListener('change', function() {
        const s = getToolState();
        if (!s[modKey]) s[modKey] = {};
        s[modKey][this.dataset.toolKey] = { checked: this.checked, name: displayName };
        saveToolState(s);
        updateToolProgress(moduleNum, toolTable);
      });
    });

    // Save updated state with names
    saveToolState(state);

    // Add progress indicator below table
    const progressDiv = document.createElement('div');
    progressDiv.id = 'tool-checklist-progress';
    progressDiv.style.cssText = 'margin-top:12px;padding:10px 14px;background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);border-radius:8px;display:flex;align-items:center;gap:12px;';
    toolTable.parentNode.insertBefore(progressDiv, toolTable.nextSibling);
    updateToolProgress(moduleNum, toolTable);
  }

  function updateToolProgress(moduleNum, toolTable) {
    const checks = toolTable.querySelectorAll('tbody input[type="checkbox"]');
    const total = checks.length;
    const done = Array.from(checks).filter(c => c.checked).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const bar = document.getElementById('tool-checklist-progress');
    if (!bar) return;

    const allDone = done === total;
    bar.innerHTML = `
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:0.85em;color:${allDone ? '#00e676' : '#b0b0cc'};">
            ${allDone ? '✅ ¡Todo listo! Puedes empezar el módulo.' : `${done}/${total} herramientas revisadas`}
          </span>
          <span style="font-size:0.85em;color:#b0b0cc;">${pct}%</span>
        </div>
        <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#00e676,#39ff14);border-radius:3px;transition:width 0.3s;"></div>
        </div>
      </div>`;
  }

  // --- Pending Tools for Dashboard ---
  // Returns pending tools for modules Juan has visited (data exists in localStorage)
  // Only includes modules where he has started (at least 1 class completed) or has visited the tools page
  function getPendingTools() {
    const state = getToolState();
    const progressState = load();
    const result = [];

    for (let modNum = 1; modNum <= 9; modNum++) {
      const modKey = `m${modNum}`;
      const modTools = state[modKey];
      if (!modTools || Object.keys(modTools).length === 0) continue;

      // Check if module has any progress (at least visited = tools registered)
      const prefix = `m${modNum}-`;
      const hasClassProgress = progressState.completedClasses.some(c => c.startsWith(prefix));

      // Only show if Juan has class progress OR has registered tools (visited the module page)
      const pending = [];
      for (const [key, data] of Object.entries(modTools)) {
        const isChecked = typeof data === 'object' ? data.checked : !!data;
        const name = typeof data === 'object' ? data.name : key;
        if (!isChecked) pending.push(name);
      }

      if (pending.length > 0) {
        const mod = MODULES[modNum];
        result.push({
          moduleNum: modNum,
          moduleName: mod ? mod.name : `Módulo ${modNum}`,
          pending,
          total: Object.keys(modTools).length,
          done: Object.keys(modTools).length - pending.length,
        });
      }
    }
    return result;
  }

  // ============================================
  //  SISTEMA DE ENTREGA DE EJERCICIOS
  // ============================================

  const SUBMISSIONS_KEY = 'curso-ia-juan-submissions';

  // --- Catálogo de ejercicios (desde M1-C06) ---
  const EXERCISES = {
    // --- Módulo 1: Python para Devs Web ---
    // Clases 01-05 NO llevan entrega (completadas antes del sistema)
    'm1-c06': [
      { num: 1, type: 'A', title: 'Sistema de carrito con clases Product y ShoppingCart' },
    ],
    'm1-c07': [
      { num: 1, type: 'B', title: 'Proyecto weather_app con entorno virtual y pytest' },
    ],
    'm1-c08': [
      { num: 1, type: 'A', title: 'Scraper de Quotes con BeautifulSoup' },
      { num: 2, type: 'B', title: 'Top 10 Repos de GitHub scraper' },
    ],
    'm1-c09': [
      { num: 1, type: 'A', title: 'App Flask paso a paso' },
      { num: 2, type: 'B', title: '3 Endpoints Flask' },
    ],
    'm1-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Mini API en Flask' },
    ],

    // --- Módulo 2: Fundamentos IA ---
    'm2-c01': [
      { num: 1, type: 'B', title: 'Mini-reto: "Explícaselo a tu abuela"' },
    ],
    'm2-c02': [
      { num: 1, type: 'B', title: 'Mini-reto: Token Detective' },
    ],
    'm2-c03': [
      { num: 1, type: 'B', title: 'Mini-reto: Prompt Battle' },
    ],
    'm2-c04': [
      { num: 1, type: 'B', title: 'Mini-reto: Ollama Challenge — Duelo de Modelos' },
    ],
    'm2-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: 5 Problemas Reales con Prompts' },
    ],

    // --- Módulo 3: APIs de IA ---
    'm3-c01': [
      { num: 1, type: 'A', title: 'Setup OpenAI + Primera llamada' },
      { num: 2, type: 'A', title: 'Input interactivo con OpenAI' },
      { num: 3, type: 'B', title: 'El traductor instantáneo' },
    ],
    'm3-c02': [
      { num: 1, type: 'B', title: 'Laboratorio de temperature' },
      { num: 2, type: 'A', title: 'System prompt designer' },
      { num: 3, type: 'A', title: 'JSON mode' },
      { num: 4, type: 'B', title: 'El generador de historias' },
    ],
    'm3-c03': [
      { num: 1, type: 'A', title: 'Chatbot básico con memoria' },
      { num: 2, type: 'A', title: 'Añadir streaming' },
      { num: 3, type: 'A', title: 'Chatbot con personalidad + sliding window' },
      { num: 4, type: 'B', title: 'El asistente de cocina' },
    ],
    'm3-c04': [
      { num: 1, type: 'A', title: 'Primera llamada con Claude API' },
      { num: 2, type: 'A', title: 'Chatbot Dual GPT vs Claude' },
      { num: 3, type: 'A', title: 'Hackea tu propio chatbot' },
      { num: 4, type: 'B', title: 'El chatbot blindado' },
    ],
    'm3-c05': [
      { num: 1, type: 'A', title: 'Invoice Parser con Pydantic' },
      { num: 2, type: 'B', title: 'Multi-Item Product Extractor' },
    ],
    'm3-c06': [
      { num: 1, type: 'A', title: 'Chatbot Streaming con contador de tokens' },
      { num: 2, type: 'B', title: 'Token Cost Calculator' },
    ],
    'm3-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Chatbot Web Desplegado' },
    ],

    // --- Módulo 4: AI Coding Tools ---
    'm4-c01': [
      { num: 1, type: 'A', title: 'Instalar y configurar GitHub Copilot' },
      { num: 2, type: 'A', title: 'Usar sugerencias inline' },
      { num: 3, type: 'A', title: 'Usar Copilot Chat' },
      { num: 4, type: 'B', title: 'El generador de funciones' },
    ],
    'm4-c02': [
      { num: 1, type: 'A', title: 'Primeros pasos con Cursor' },
      { num: 2, type: 'A', title: 'Tab y Cmd+K en Cursor' },
      { num: 3, type: 'A', title: 'Chat con @symbols' },
      { num: 4, type: 'A', title: 'Composer: crear feature completa' },
      { num: 5, type: 'B', title: 'De idea a código en 5 minutos' },
    ],
    'm4-c03': [
      { num: 1, type: 'A', title: 'Claude Code Setup' },
      { num: 2, type: 'A', title: 'Feature simple con Claude Code' },
      { num: 3, type: 'A', title: 'Windsurf Setup' },
      { num: 4, type: 'A', title: 'El mismo cambio en 3 herramientas' },
      { num: 5, type: 'B', title: 'Dark Mode en 3 IDEs' },
    ],
    'm4-c04': [
      { num: 1, type: 'A', title: 'TDD con Copilot' },
      { num: 2, type: 'A', title: 'Refactoring Challenge' },
      { num: 3, type: 'A', title: 'Debug con IA' },
      { num: 4, type: 'A', title: 'Crear AGENTS.md' },
      { num: 5, type: 'B', title: 'TDD Speed Run' },
    ],
    'm4-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Proyecto Integrador M4' },
    ],

    // --- Módulo 5: Context, Search & RAG ---
    'm5-c01': [
      { num: 1, type: 'A', title: 'Primera llamada con context stuffing' },
      { num: 2, type: 'B', title: 'Asistente sobre tu apunte (3 preguntas)' },
    ],
    'm5-c02': [
      { num: 1, type: 'A', title: 'Stuff un PDF de 200 páginas en Claude Sonnet' },
      { num: 2, type: 'A', title: 'Medir tokens y coste por llamada' },
      { num: 3, type: 'B', title: 'Comparar respuesta con doc partido vs entero' },
    ],
    'm5-c03': [
      { num: 1, type: 'A', title: 'Primera tool con Anthropic SDK' },
      { num: 2, type: 'A', title: 'Tool search_docs sobre directorio local' },
      { num: 3, type: 'B', title: 'Agente agentic search con 3 tools' },
    ],
    'm5-c04': [
      { num: 1, type: 'A', title: 'Primer embedding con openai.embeddings' },
      { num: 2, type: 'A', title: 'Vector store con ChromaDB (sin LangChain)' },
      { num: 3, type: 'B', title: 'Similaridad semántica sobre 20 frases propias' },
    ],
    'm5-c05': [
      { num: 1, type: 'A', title: 'Pipeline RAG clásico de punta a punta' },
      { num: 2, type: 'B', title: 'Probar chunking sizes + reranking' },
    ],
    'm5-c06': [
      { num: 1, type: 'A', title: 'Benchmark: stuffing vs agentic vs RAG sobre mismo corpus' },
      { num: 2, type: 'B', title: 'Tabla de decisión justificada' },
    ],
    'm5-c07': [
      { num: 1, type: 'A', title: 'Primera evaluación con Ragas' },
      { num: 2, type: 'B', title: 'LLM-as-judge sobre 10 respuestas' },
    ],
    'm5-c08': [
      { num: 1, type: 'A', title: 'Frontend con Next.js + Vercel AI SDK streaming' },
      { num: 2, type: 'B', title: 'Chat con markdown y citas de fuentes' },
    ],
    'm5-c09': [
      { num: 1, type: 'A', title: 'Tracing con Langfuse' },
      { num: 2, type: 'B', title: 'Deploy en Vercel con observability' },
    ],
    'm5-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Pregúntale a Mis Apuntes (3 arquitecturas comparadas)' },
    ],

    // --- Módulo 6: Agentes de IA ---
    'm6-c01': [
      { num: 1, type: 'A', title: 'SimpleAgent con agentic loops' },
      { num: 2, type: 'B', title: 'Wikipedia agent con tool use' },
    ],
    'm6-c02': [
      { num: 1, type: 'A', title: 'Function calling con weather y calculator' },
      { num: 2, type: 'B', title: 'Agente con 3 tools' },
    ],
    'm6-c03': [
      { num: 1, type: 'A', title: 'CrewAI: equipo de 2 agentes' },
      { num: 2, type: 'B', title: 'Crew de 3 agentes para content creation' },
    ],
    'm6-c04': [
      { num: 1, type: 'A', title: 'LangGraph con StateGraph' },
      { num: 2, type: 'B', title: 'Research Agent con LangGraph' },
    ],
    'm6-c05': [
      { num: 1, type: 'A', title: 'Mini Eval Harness' },
      { num: 2, type: 'A', title: 'A/B Test de agentes' },
      { num: 3, type: 'A', title: 'DeepEval integration' },
    ],
    'm6-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Multi-source Research Agent' },
    ],

    // --- Módulo 7: Full-Stack AI App ---
    'm7-c01': [
      { num: 1, type: 'A', title: 'Next.js con Vercel AI SDK' },
      { num: 2, type: 'B', title: 'Streaming chat en Next.js' },
    ],
    'm7-c02': [
      { num: 1, type: 'A', title: 'Auth.js integration' },
      { num: 2, type: 'B', title: 'User sessions y auth en chat' },
    ],
    'm7-c03': [
      { num: 1, type: 'A', title: 'Rate limiting y API quotas' },
      { num: 2, type: 'B', title: 'Rate limiting middleware' },
    ],
    'm7-c04': [
      { num: 1, type: 'A', title: 'Chat UI/UX patterns' },
      { num: 2, type: 'B', title: 'Chat interface con message history' },
    ],
    'm7-c05': [
      { num: 1, type: 'A', title: 'Docker containerization' },
      { num: 2, type: 'B', title: 'Containerizar app full-stack' },
    ],
    'm7-c06': [
      { num: 1, type: 'A', title: 'FastAPI backend para AI' },
      { num: 2, type: 'B', title: 'Endpoints FastAPI para LLM' },
    ],
    'm7-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Asistente IA Full-Stack' },
    ],

    // --- Módulo 8: Portfolio, CV y Job-Ready ---
    'm8-c01': [
      { num: 1, type: 'A', title: 'README profesional con badges y demos' },
      { num: 2, type: 'B', title: 'README de alto impacto para proyecto AI' },
    ],
    'm8-c02': [
      { num: 1, type: 'A', title: 'Optimización perfil GitHub' },
      { num: 2, type: 'B', title: 'Perfil GitHub para AI developer' },
    ],
    'm8-c03': [
      { num: 1, type: 'A', title: 'CV con skills de IA' },
      { num: 2, type: 'B', title: 'CV destacando expertise en IA' },
    ],
    'm8-c04': [
      { num: 1, type: 'A', title: 'Optimización LinkedIn' },
      { num: 2, type: 'B', title: 'Presencia LinkedIn para roles IA' },
    ],
    'm8-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Portfolio web + vídeo presentación' },
    ],

    // --- Módulo 9: Búsqueda Activa de Empleo ---
    'm9-c01': [
      { num: 1, type: 'A', title: 'Plataformas de búsqueda de empleo' },
      { num: 2, type: 'B', title: 'Optimizar perfiles en plataformas' },
    ],
    'm9-c02': [
      { num: 1, type: 'A', title: 'Análisis de ofertas y CV adaptado' },
      { num: 2, type: 'B', title: 'Crear 2 versiones del CV' },
    ],
    'm9-c03': [
      { num: 1, type: 'A', title: 'Preparación de entrevistas' },
      { num: 2, type: 'B', title: 'Practicar entrevistas técnicas' },
    ],
    'm9-c04': [
      { num: 1, type: 'A', title: 'Networking y marca personal' },
      { num: 2, type: 'B', title: 'Estrategia de networking' },
    ],
    'm9-bb': [
      { num: 1, type: 'D', title: 'Boss Battle: Plan de búsqueda de empleo 30 días' },
    ],
  };

  // --- XP por tipo de ejercicio ---
  const EXERCISE_XP = {
    A: { onSubmit: 5, onApprove: 0 },   // Auto-aprueba
    B: { onSubmit: 5, onApprove: 5 },
    C: { onSubmit: 0, onApprove: 15 },   // Bonus
    D: { onSubmit: 0, onApprove: 50 },
  };

  // --- Storage de entregas ---
  function getSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || {};
    } catch (e) { return {}; }
  }

  function saveSubmission(classId, exerciseNum, issueNum, url) {
    const subs = getSubmissions();
    if (!subs[classId]) subs[classId] = {};
    subs[classId][exerciseNum] = {
      issueNum,
      url,
      date: new Date().toISOString(),
      status: 'pendiente',
    };
    try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs)); } catch (e) { /* ignore */ }
  }

  function updateSubmissionStatus(classId, exNum, newStatus) {
    const subs = getSubmissions();
    if (subs[classId] && subs[classId][exNum]) {
      subs[classId][exNum].status = newStatus;
      try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs)); } catch (e) { /* ignore */ }
    }
  }

  function getSubmissionSummary() {
    const subs = getSubmissions();
    let totalRequired = 0;   // Solo B, C, D (obligatorios)
    let totalOptional = 0;   // Solo A (prácticas guiadas)
    let submittedRequired = 0;
    let submittedOptional = 0;
    let pending = 0;
    let approved = 0;

    // Contar desde catálogo separando obligatorios (B/C/D) y opcionales (A)
    for (const [classId, exList] of Object.entries(EXERCISES)) {
      for (const ex of exList) {
        if (ex.type === 'A') {
          totalOptional++;
          if (subs[classId] && subs[classId][ex.num]) submittedOptional++;
        } else {
          totalRequired++;
          if (subs[classId] && subs[classId][ex.num]) submittedRequired++;
        }
      }
    }

    // Contar estados de todas las entregas
    for (const exercises of Object.values(subs)) {
      for (const data of Object.values(exercises)) {
        if (data.status === 'aprobado') approved++;
        else if (data.status === 'pendiente') pending++;
      }
    }

    return {
      totalRequired,
      totalOptional,
      submittedRequired,
      submittedOptional,
      submitted: submittedRequired + submittedOptional,
      pending,
      approved,
      reviewed: (submittedRequired + submittedOptional) - pending - approved,
      missing: totalRequired - submittedRequired,
    };
  }

  // --- Mostrar estado en formulario ---
  function _showSubmitStatus(exerciseNum, html, type) {
    const el = document.getElementById(`submit-status-ejercicio-${exerciseNum}`);
    if (!el) return;
    const colors = { success: '#00e676', warning: '#ffa726', error: '#ff5252' };
    el.style.color = colors[type] || '#b0b0cc';
    el.innerHTML = html;
  }

  // --- Enviar ejercicio como GitHub Issue ---
  async function submitExercise(classId, exerciseNum, buttonEl) {
    const token = localStorage.getItem(SYNC_TOKEN_KEY);
    if (!token) {
      _showSubmitStatus(exerciseNum, '⚠️ Configura la sincronización en el dashboard primero.', 'warning');
      return;
    }

    // Recoger datos del formulario
    const container = buttonEl.closest('.exercise-submit');
    const dataType = container ? container.dataset.type : 'mini-reto';

    let code = '';
    let notes = '';
    let repoUrl = '';
    let deployUrl = '';
    let reflection = '';

    if (dataType === 'boss-battle') {
      const inputs = container.querySelectorAll('input[type="url"]');
      repoUrl = inputs[0] ? inputs[0].value.trim() : '';
      deployUrl = inputs[1] ? inputs[1].value.trim() : '';
      const textareas = container.querySelectorAll('textarea');
      code = textareas[0] ? textareas[0].value.trim() : '';
      reflection = textareas[1] ? textareas[1].value.trim() : '';
    } else {
      const codeEl = document.getElementById(`code-ejercicio-${exerciseNum}`);
      const notesEl = document.getElementById(`notes-ejercicio-${exerciseNum}`);
      code = codeEl ? codeEl.value.trim() : '';
      notes = notesEl ? notesEl.value.trim() : '';

      // Checkbox para code-along
      if (dataType === 'code-along') {
        const check = container.querySelector('input[type="checkbox"]');
        if (check && !check.checked) {
          _showSubmitStatus(exerciseNum, '⚠️ Confirma que te funciona antes de entregar.', 'warning');
          return;
        }
      }

      // Output para mini-reto
      const outputEl = document.getElementById(`output-ejercicio-${exerciseNum}`);
      if (outputEl) {
        const output = outputEl.value.trim();
        if (output) notes = `**Output:**\n\`\`\`\n${output}\n\`\`\`\n\n${notes}`;
      }
    }

    // Validación mínima
    if (!code && !repoUrl) {
      _showSubmitStatus(exerciseNum, '⚠️ Pega tu código antes de entregar.', 'warning');
      return;
    }
    if (code.length < 50 && !repoUrl) {
      _showSubmitStatus(exerciseNum, '⚠️ El código parece muy corto (mín. 50 caracteres).', 'warning');
      return;
    }

    // Deshabilitar botón
    const originalText = buttonEl.textContent;
    buttonEl.textContent = 'Enviando...';
    buttonEl.disabled = true;

    // Parsear classId
    const [modPart, classPart] = classId.split('-');
    const moduleNum = modPart.replace('m', '');
    const classNum = classPart.replace('c', '');
    const moduleName = MODULES[moduleNum] ? MODULES[moduleNum].name : `Módulo ${moduleNum}`;

    // Leer tipo y título del catálogo
    const exList = EXERCISES[classId] || [];
    const exInfo = exList.find(e => e.num === exerciseNum) || {};
    const typeLabels = { A: 'code-along', B: 'mini-reto', C: 'reto-extra', D: 'boss-battle' };
    const typeNames = { A: 'Práctica Guiada', B: 'Mini-Reto', C: 'Reto Extra', D: 'Boss Battle' };
    const exType = exInfo.type || 'B';
    const exTitle = exInfo.title || `Ejercicio ${exerciseNum}`;

    const title = `[${typeNames[exType]}] M${moduleNum} C${classNum} — ${exTitle}`;

    // Construir body del Issue
    const bodyParts = [
      `## ${typeNames[exType]}: ${exTitle}`,
      ``,
      `| Campo | Valor |`,
      `|-------|-------|`,
      `| **Módulo** | ${moduleNum} — ${moduleName} |`,
      `| **Clase** | ${classNum} |`,
      `| **Tipo** | ${typeNames[exType]} |`,
      `| **Ejercicio** | ${exerciseNum} |`,
      `| **Fecha** | ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')} |`,
    ];

    if (repoUrl) bodyParts.push(`| **Repo** | ${repoUrl} |`);
    if (deployUrl) bodyParts.push(`| **Deploy** | ${deployUrl} |`);

    bodyParts.push(``, `### Código`, ``, '```python', code, '```');

    if (reflection) bodyParts.push(``, `### Reflexión de Juan`, ``, reflection);
    if (notes) bodyParts.push(``, `### Notas de Juan`, ``, notes);

    bodyParts.push(``, `---`, `*Enviado desde el curso IA para Desarrolladores Web*`);

    const body = bodyParts.join('\n');
    const labels = ['entrega', typeLabels[exType], `m${moduleNum}`, classId, 'pendiente'];

    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body, labels }),
      });

      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const issue = await res.json();

      // Guardar en localStorage
      saveSubmission(classId, exerciseNum, issue.number, issue.html_url);

      // XP por entrega
      const xpOnSubmit = EXERCISE_XP[exType] ? EXERCISE_XP[exType].onSubmit : 0;
      if (xpOnSubmit > 0) {
        const state = load();
        state.xp += xpOnSubmit;
        // Badge primera entrega
        if (!state.badges.includes('first-submit')) {
          state.badges.push('first-submit');
        }
        save(state);
      }

      _showSubmitStatus(exerciseNum,
        `✅ Entregado — <a href="${issue.html_url}" target="_blank" style="color:#00e676;">Ver en GitHub #${issue.number}</a>` +
        (xpOnSubmit > 0 ? ` (+${xpOnSubmit} XP)` : ''),
        'success');

      // Actualizar UI del formulario
      _markFormAsSubmitted(container, issue.html_url, issue.number, 'pendiente');

    } catch (err) {
      _showSubmitStatus(exerciseNum, `❌ Error al entregar: ${err.message}`, 'error');
    } finally {
      buttonEl.textContent = originalText;
      buttonEl.disabled = false;
    }
  }

  function _markFormAsSubmitted(container, url, issueNum, status) {
    if (!container) return;
    const textareas = container.querySelectorAll('textarea');
    const inputs = container.querySelectorAll('input');
    textareas.forEach(t => { t.disabled = true; t.style.opacity = '0.6'; });
    inputs.forEach(i => { i.disabled = true; i.style.opacity = '0.6'; });
    const btn = container.querySelector('button');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
  }

  // --- Indicadores al cargar clase ---
  function initSubmissionIndicators(classId) {
    const subs = getSubmissions();
    const classSubs = subs[classId];
    if (!classSubs) return;

    for (const [exNum, data] of Object.entries(classSubs)) {
      const statusEl = document.getElementById(`submit-status-ejercicio-${exNum}`);
      if (!statusEl) continue;

      if (data.status === 'aprobado') {
        statusEl.innerHTML = `🏆 Aprobado — <a href="${data.url}" target="_blank" style="color:#00e676;">Ver en GitHub #${data.issueNum}</a>`;
        statusEl.style.color = '#00e676';
      } else if (data.status === 'revisado') {
        statusEl.innerHTML = `💬 Tienes feedback — <a href="${data.url}" target="_blank" style="color:#bb86fc;">Ver en GitHub #${data.issueNum}</a>`;
        statusEl.style.color = '#bb86fc';
      } else {
        statusEl.innerHTML = `✅ Entregado — <a href="${data.url}" target="_blank" style="color:#00e676;">Ver en GitHub #${data.issueNum}</a>`;
        statusEl.style.color = '#00e676';
      }

      // Deshabilitar formulario si ya entregó
      const container = statusEl.closest('.exercise-submit');
      if (container) _markFormAsSubmitted(container, data.url, data.issueNum, data.status);
    }
  }

  // --- Sync de estados desde GitHub Issues ---
  const SYNC_STATUS_KEY = 'curso-ia-juan-last-status-sync';
  const SYNC_STATUS_THROTTLE = 5 * 60 * 1000; // 5 min

  async function syncSubmissionStatuses() {
    const token = localStorage.getItem(SYNC_TOKEN_KEY);
    if (!token) return;

    // Throttle
    try {
      const lastSync = parseInt(localStorage.getItem(SYNC_STATUS_KEY) || '0', 10);
      if (Date.now() - lastSync < SYNC_STATUS_THROTTLE) return;
    } catch (e) { /* continue */ }

    const submissions = getSubmissions();
    const pendingIssues = [];

    for (const [classId, exercises] of Object.entries(submissions)) {
      for (const [exNum, data] of Object.entries(exercises)) {
        if (data.status !== 'aprobado') {
          pendingIssues.push({ classId, exNum, issueNum: data.issueNum });
        }
      }
    }

    if (pendingIssues.length === 0) return;

    for (const item of pendingIssues) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/issues/${item.issueNum}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (!res.ok) continue;
        const issue = await res.json();

        const labels = issue.labels.map(l => l.name);
        let newStatus = 'pendiente';
        if (labels.includes('aprobado')) newStatus = 'aprobado';
        else if (labels.includes('revisado') || issue.comments > 0) newStatus = 'revisado';

        updateSubmissionStatus(item.classId, item.exNum, newStatus);
      } catch (e) { /* skip this issue */ }
    }

    try { localStorage.setItem(SYNC_STATUS_KEY, String(Date.now())); } catch (e) { /* ignore */ }
  }

  // --- Pull submissions from GitHub Issues (rebuild localStorage from remote) ---
  async function pullSubmissionsFromGitHub() {
    // Fetch all issues with label 'entrega' (no auth needed for public repos)
    try {
      const url = `https://api.github.com/repos/${GITHUB_REPO}/issues?state=all&labels=entrega&per_page=50&t=${Date.now()}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
      if (!res.ok) return false;
      const issues = await res.json();
      if (issues.length === 0) return false;

      const subs = getSubmissions();
      let changed = false;

      for (const issue of issues) {
        const labels = (issue.labels || []).map(l => l.name);

        // Extract classId from labels (e.g., m1-c07)
        const claseLabel = labels.find(l => /^m\d+-c\d+$/.test(l) || /^m\d+-bb$/.test(l));
        if (!claseLabel) continue;

        // Determine exercise number from issue title or default to 1
        let exNum = 1;
        const exMatch = issue.title.match(/Ejercicio\s+(\d+)/i);
        if (exMatch) exNum = parseInt(exMatch[1], 10);

        // Determine status
        let status = 'pendiente';
        if (labels.includes('aprobado')) status = 'aprobado';
        else if (labels.includes('revisado') || issue.comments > 0) status = 'revisado';

        // Only update if not already tracked or status improved
        if (!subs[claseLabel]) subs[claseLabel] = {};
        const existing = subs[claseLabel][exNum];
        if (!existing || _statusRank(status) > _statusRank(existing.status)) {
          subs[claseLabel][exNum] = {
            issueNum: issue.number,
            url: issue.html_url,
            date: issue.created_at,
            status,
          };
          changed = true;
        }
      }

      if (changed) {
        try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs)); } catch (e) { /* ignore */ }
      }
      return changed;
    } catch (e) {
      console.warn('Error pulling submissions from GitHub:', e);
      return false;
    }
  }

  function _statusRank(s) {
    if (s === 'aprobado') return 3;
    if (s === 'revisado') return 2;
    return 1;
  }

  // --- API pública ---
  return {
    completeClass,
    getState,
    getLevel,
    getLevelInfo,
    getModuleProgress,
    getTotalProgress,
    isClassCompleted,
    getTestScore,
    initQuiz,
    submitQuiz,
    renderXPBar,
    renderBadges,
    renderStreak,
    showRewardSequence,
    getSkillProfile,
    initToolChecklist,
    getPendingTools,
    reset,
    syncToGitHub,
    pullFromGitHub,
    checkSyncSetup,
    isSyncEnabled,
    submitExercise,
    getSubmissions,
    getSubmissionSummary,
    syncSubmissionStatuses,
    pullSubmissionsFromGitHub,
    initSubmissionIndicators,
    BADGES,
    MODULES,
    EXERCISES,
    REWARDS,
    SKILL_AREAS,
    PASS_THRESHOLD,
  };
})();

// Auto-check sync setup on every page load
document.addEventListener('DOMContentLoaded', () => CourseProgress.checkSyncSetup());

// Cross-tab sync: si otra pestaña actualiza localStorage, recargar estado
window.addEventListener('storage', (e) => {
  if (e.key === 'juan-curso-ia-progress' && e.newValue) {
    // Actualizar UI si hay elementos de progreso visibles
    const levelEl = document.querySelector('.level-badge');
    const xpEl = document.querySelector('.xp-display');
    if (levelEl || xpEl) {
      const state = CourseProgress.getState();
      const info = CourseProgress.getLevelInfo(state.xp);
      if (levelEl) levelEl.textContent = `Nv. ${info.level}`;
      if (xpEl) xpEl.textContent = `${state.xp} XP`;
    }
  }
});

