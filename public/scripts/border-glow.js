// BorderGlow — Vanilla JS port for Astro
// Adds edge-glow effect to any element with data-border-glow attribute

(function () {
  'use strict';

  function parseHSL(hslStr) {
    const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!match) return { h: 120, s: 100, l: 50 };
    return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
  }

  function buildGlowVars(glowColor, intensity) {
    const { h, s, l } = parseHSL(glowColor);
    const base = `${h}deg ${s}% ${l}%`;
    const opacities = [100, 60, 50, 40, 30, 20, 10];
    const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    const vars = {};
    for (let i = 0; i < opacities.length; i++) {
      vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
    }
    return vars;
  }

  const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
  const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

  function buildGradientVars(colors) {
    const vars = {};
    for (let i = 0; i < 7; i++) {
      const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
      vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
    }
    vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
    return vars;
  }

  function getCenterOfElement(el) {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }

  function getEdgeProximity(el, x, y) {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function getCursorAngle(el, x, y) {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  function initBorderGlow(el) {
    if (el._borderGlow) return;

    // Read config from data attributes
    const config = {
      edgeSensitivity: parseInt(el.dataset.edgeSensitivity) || 30,
      glowColor: el.dataset.glowColor || '120 100 50',
      backgroundColor: el.dataset.backgroundColor || 'transparent',
      borderRadius: parseInt(el.dataset.borderRadius) || 999,
      glowRadius: parseInt(el.dataset.glowRadius) || 40,
      glowIntensity: parseFloat(el.dataset.glowIntensity) || 1.0,
      coneSpread: parseInt(el.dataset.coneSpread) || 25,
      animated: el.dataset.animated === 'true',
      colors: (el.dataset.colors || '#ccff00,#4caf50,#2e7d32').split(','),
      fillOpacity: parseFloat(el.dataset.fillOpacity) || 0.5,
    };

    const colorSensitivity = config.edgeSensitivity + 20;

    // Apply CSS custom properties
    const glowVars = buildGlowVars(config.glowColor, config.glowIntensity);
    const gradientVars = buildGradientVars(config.colors);

    el.style.setProperty('--card-bg', config.backgroundColor);
    el.style.setProperty('--edge-sensitivity', config.edgeSensitivity);
    el.style.setProperty('--border-radius', `${config.borderRadius}px`);
    el.style.setProperty('--glow-padding', `${config.glowRadius}px`);
    el.style.setProperty('--cone-spread', config.coneSpread);
    el.style.setProperty('--fill-opacity', config.fillOpacity);
    el.style.setProperty('--color-sensitivity', colorSensitivity);

    Object.entries(glowVars).forEach(([k, v]) => el.style.setProperty(k, v));
    Object.entries(gradientVars).forEach(([k, v]) => el.style.setProperty(k, v));

    // Add inner wrapper if not present
    let inner = el.querySelector('.border-glow-inner');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'border-glow-inner';
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    }

    // Add edge-light span
    let edgeLight = el.querySelector('.edge-light');
    if (!edgeLight) {
      edgeLight = document.createElement('span');
      edgeLight.className = 'edge-light';
      el.insertBefore(edgeLight, el.firstChild);
    }

    // Pointer move handler
    function handlePointerMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge = getEdgeProximity(el, x, y);
      const angle = getCursorAngle(el, x, y);

      el.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
      el.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    }

    el.addEventListener('pointermove', handlePointerMove);

    el._borderGlow = {
      destroy() {
        el.removeEventListener('pointermove', handlePointerMove);
        delete el._borderGlow;
      }
    };
  }

  // Auto-init
  function initAll() {
    document.querySelectorAll('[data-border-glow]').forEach(initBorderGlow);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.BorderGlow = { init: initBorderGlow };
})();
