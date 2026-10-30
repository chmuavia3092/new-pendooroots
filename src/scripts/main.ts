/**
 * PENDOOROOTS — Client-side Hydration Entry Point
 * Initializes interactive islands and global functionality
 */

// Import GSAP and plugins
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dynamic imports for optional components (non-blocking)
import('@/components/hero/HeroBottle').catch(() => {});
import('@/components/hero/HeroGrainient').catch(() => {});
import('@/components/ui/SpecularButton').catch(() => {});
import('@/components/ui/StarBorderButton').catch(() => {});
import('@/components/ui/ElectricBorder').catch(() => {});
import('@/components/ui/MagicBento').catch(() => {});

// Global state
declare global {
  interface Window {
    Store: any;
    formatRs: (n: number) => string;
    navigate: (page: string, data?: any) => void;
    showToast: (message: string, type?: string) => void;
  }
}

// Theme initialization
function initTheme(): void {
  const savedTheme = localStorage.getItem('pr_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
  const meta = document.getElementById('themeColorMeta') as HTMLMetaElement;
  if (meta) {
    meta.setAttribute('content', savedTheme === 'dark' ? '#0a0a0f' : '#004b1c');
  }
}

// Smart Navbar � changes theme based on section underneath
function initNavbarScroll(): void {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Sections that should make navbar dark (light backgrounds)
  const lightSections = document.querySelectorAll('[data-navbar-theme="light"]');
  const darkSections = document.querySelectorAll('[data-navbar-theme="dark"]');

  // Tracks which themed sections currently sit under the navbar strip.
  // When none do (e.g. back at the hero), both classes are removed so the
  // navbar falls back to its transparent default instead of keeping the
  // last-entered theme.
  const activeThemes = new Map<Element, string>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const theme = entry.target.getAttribute('data-navbar-theme');
        if (!theme) return;
        if (entry.isIntersecting) {
          activeThemes.set(entry.target, theme);
        } else {
          activeThemes.delete(entry.target);
        }
      });

      let current: string | undefined;
      activeThemes.forEach(t => { current = t; });

      navbar.classList.toggle('navbar--light', current === 'light');
      navbar.classList.toggle('navbar--dark', current === 'dark');
    },
    {
      root: null,
      rootMargin: '-72px 0px 0px 0px', // Account for navbar height (72px)
      threshold: 0.1
    }
  );

  lightSections.forEach(section => observer.observe(section));
  darkSections.forEach(section => observer.observe(section));

  // Fallback for pages without data-navbar-theme sections
  window.addEventListener('scroll', () => {
    if (!document.querySelector('[data-navbar-theme]')) {
      document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}



// Mobile menu toggle
function initMobileMenu(): void {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.mobile-link');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    hamburger?.setAttribute('aria-expanded', hamburger.classList.contains('active').toString());
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });
}

// Theme toggle
function initThemeToggle(): void {
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pr_theme', newTheme);
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    const meta = document.getElementById('themeColorMeta') as HTMLMetaElement;
    if (meta) {
      meta.setAttribute('content', newTheme === 'dark' ? '#0a0a0f' : '#004b1c');
    }
  });
}

// Search overlay
function initSearch(): void {
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;

  searchToggle?.addEventListener('click', () => {
    searchOverlay?.classList.add('active');
    searchInput?.focus();
  });

  searchClose?.addEventListener('click', () => {
    searchOverlay?.classList.remove('active');
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay?.classList.remove('active');
    }
  });
}

// Cart sidebar
function initCart(): void {
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');

  const openCart = () => {
    cartSidebar?.classList.add('active');
    cartOverlay?.classList.add('active');
    renderCartSidebar();
  };

  const closeCart = () => {
    cartSidebar?.classList.remove('active');
    cartOverlay?.classList.remove('active');
  };

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
    }
  });
}

function renderCartSidebar(): void {
  // This will be implemented when we add the cart store
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  if (cartItems) {
    cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your bag is empty</p></div>';
  }
  if (cartFooter) {
    cartFooter.style.display = 'none';
  }
}

// Reveal animations (IntersectionObserver)
function initRevealAnimations(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Counter animations
function initCounters(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.count || '0');
        if (!target) return;
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString() + (target >= 100 ? '+' : '');
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
}

// Custom cursor — spring-physics arrow + "finding..." label
// Ported from the Motion reference component: position springs (damping 25,
// stiffness 300), velocity-based tilt (rotation spring 15/200, ±45°),
// speed scale-down, and squash-and-stretch on the label.
function initCursor(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  const cursorSvg = cursor?.querySelector('svg');
  if (!cursor || !follower || !cursorSvg) return;

  document.documentElement.classList.add('cursor-active');

  interface Spring { pos: number; vel: number; target: number; k: number; c: number; }
  const makeSpring = (k: number, c: number): Spring => ({ pos: 0, vel: 0, target: 0, k, c });
  const integrate = (s: Spring, dt: number): void => {
    const a = s.k * (s.target - s.pos) - s.c * s.vel;
    s.vel += a * dt;
    s.pos += s.vel * dt;
  };

  const curX = makeSpring(300, 25); // arrow position
  const curY = makeSpring(300, 25);
  const folX = makeSpring(300, 25); // label position
  const folY = makeSpring(300, 25);
  const rot = makeSpring(200, 15);  // arrow tilt

  let started = false;

  document.addEventListener('mousemove', (e) => {
    if (!started) {
      // snap to first position — no sweep in from the corner
      curX.pos = curX.target = e.clientX; curY.pos = curY.target = e.clientY;
      folX.pos = folX.target = e.clientX; folY.pos = folY.target = e.clientY;
      started = true;
    }
    curX.target = e.clientX;
    curY.target = e.clientY;
    // label sits below-right of the tip (side: bottom / align: end offsets)
    folX.target = e.clientX + 5;
    folY.target = e.clientY + 15;
  });

  // piecewise-linear velocity mapping from the reference ([-1000, 0, 1000] ranges)
  const mapRange = (v: number, neg: number, zero: number, pos: number): number => {
    const t = Math.max(-1000, Math.min(1000, v));
    return t < 0 ? zero + (neg - zero) * (-t / 1000) : zero + (pos - zero) * (t / 1000);
  };

  let last = performance.now();
  const tick = (now: number): void => {
    const dt = Math.min((now - last) / 1000, 1 / 30); // clamp for stability
    last = now;

    integrate(curX, dt); integrate(curY, dt);
    integrate(folX, dt); integrate(folY, dt);

    if (started) {
      const vx = curX.vel; // px/s
      const vy = curY.vel;

      // arrow: velocity tilt (±45°) + subtle scale-down with speed
      rot.target = Math.max(-45, Math.min(45, (vx / 1000) * 30 + (vy / 1000) * 30));
      integrate(rot, dt);
      const speed = Math.sqrt(vx * vx + vy * vy);
      const scale = 1 - Math.min(speed / 2000, 0.1);

      cursor.style.transform = `translate(${curX.pos}px, ${curY.pos}px) translate(-4.5%, -11%)`;
      cursorSvg.style.transform = `rotate(${rot.pos}deg) scale(${scale})`;

      // label: squash & stretch from velocity
      const scaleX = mapRange(vx, 0.9, 1, 1.15);
      const scaleY = mapRange(vy, 1.15, 1, 0.9);
      const skewX = mapRange(vx, -3, 0, 3);
      const skewY = mapRange(vy, -3, 0, 3);
      follower.style.transform =
        `translate(${folX.pos}px, ${folY.pos}px) ` +
        `scaleX(${scaleX}) scaleY(${scaleY}) skewX(${skewX}deg) skewY(${skewY}deg)`;
    }

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Hero particles
function initHeroParticles(): void {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    container.appendChild(p);
  }
}

// Hero sparkles
function initHeroSparkles(): void {
  const showcase = document.querySelector('.hero-product-showcase');
  if (!showcase) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'hero-sparkle';
    s.style.left = (20 + Math.random() * 60) + '%';
    s.style.top = (10 + Math.random() * 80) + '%';
    s.style.setProperty('--spark-drift', (Math.random() * 120 - 60) + 'px');
    s.style.animationDuration = (Math.random() * 4 + 3) + 's';
    s.style.animationDelay = (Math.random() * 5) + 's';
    s.style.width = s.style.height = (Math.random() * 3 + 1) + 'px';
    showcase.appendChild(s);
  }
}

// Testimonial auto-scroll
function initTestimonialScroll(): void {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let scrollPos = 0;
  function autoScroll(): void {
    scrollPos += 0.5;
    if (scrollPos >= track.scrollWidth - track.clientWidth) scrollPos = 0;
    track.scrollLeft = scrollPos;
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);
}

// Preloader is CSS-only (animation in BaseLayout.astro), no JS needed

// Navigation (client-side routing for SPA-like behavior)
function initNavigation(): void {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('[data-page]');
    if (link) {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) {
        // For now, let the browser handle navigation
        // In a full SPA, we'd use navigate(page)
        window.location.href = link.getAttribute('href') || '/';
      }
    }
  });
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScroll();
  initMobileMenu();
  initThemeToggle();
  initSearch();
  initCart();
  initNavigation();
  initRevealAnimations();
  initCounters();

  // Heavy initializations (delayed)
  setTimeout(() => {
    initCursor();
    initHeroParticles();
    initHeroSparkles();
    initTestimonialScroll();
  }, 2500);
});

// Export for global access (legacy compatibility)
window.formatRs = (n: number) => 'Rs.' + new Intl.NumberFormat('en-PK').format(n);
