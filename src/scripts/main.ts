/**
 * PENDOOROOTS — Client-side Hydration Entry Point
 * Initializes interactive islands and global functionality
 */

// Import GSAP and plugins
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Cart & wishlist store (localStorage-persisted, pub/sub synced)
import {
  addToCart,
  setCartQty,
  removeFromCart,
  getCart,
  getCartItems,
  cartCount,
  cartSubtotal,
  shippingCost,
  getWishlist,
  getWishlistItems,
  isInWishlist,
  toggleWishlist,
  removeFromWishlist,
  getProduct,
  onStoreChange,
} from '@/store';

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

// ── Commerce: cart + wishlist ────────────────────────────────────────
const money = (n: number): string => 'Rs.' + new Intl.NumberFormat('en-PK').format(n);

function updateBadges(): void {
  const bagCount = cartCount();
  const wishCount = getWishlist().length;
  const cartBadge = document.getElementById('cartBadge');
  const wishBadge = document.getElementById('wishlistBadge');
  if (cartBadge) {
    cartBadge.textContent = String(bagCount);
    cartBadge.classList.toggle('visible', bagCount > 0);
  }
  if (wishBadge) {
    wishBadge.textContent = String(wishCount);
    wishBadge.classList.toggle('visible', wishCount > 0);
  }
}

function syncWishlistButtons(): void {
  document.querySelectorAll<HTMLElement>('[data-wishlist-toggle]').forEach((btn) => {
    const id = Number(btn.getAttribute('data-wishlist-toggle'));
    const wishlisted = isInWishlist(id);
    btn.classList.toggle('wishlisted', wishlisted);
    btn.setAttribute('aria-label', wishlisted ? 'Remove from wishlist' : 'Add to wishlist');
    btn.setAttribute('aria-pressed', String(wishlisted));
  });
}

function showToast(message: string, type = 'success'): void {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icon =
    type === 'error' ? 'fa-times-circle' : type === 'info' ? 'fa-info-circle' : 'fa-check-circle';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const ico = document.createElement('i');
  ico.className = `fas ${icon}`;
  ico.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(ico, text);
  container.appendChild(toast);
  window.setTimeout(() => {
    toast.classList.add('toast-exit');
    window.setTimeout(() => toast.remove(), 350);
  }, 2600);
}

function renderCartSidebar(): void {
  const wrap = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (!wrap) return;
  const items = getCartItems();

  if (!items.length) {
    wrap.innerHTML =
      '<div class="cart-empty"><i class="fas fa-shopping-bag" aria-hidden="true"></i><p>Your bag is empty</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = '';

  wrap.innerHTML = items
    .map(
      ({ product: p, qty }) => `
    <div class="cart-item-sidebar">
      <div class="cart-item-sidebar-img"><img src="${p.image}" alt="${p.name}" width="80" height="80" loading="lazy" /></div>
      <div class="cart-item-sidebar-info">
        <div class="cart-item-sidebar-name">${p.name} · ${p.variant}</div>
        <div class="cart-item-sidebar-price">${money(p.price * qty)}</div>
        <div class="cart-item-sidebar-qty">
          <button type="button" data-cart-dec="${p.id}" aria-label="Decrease quantity of ${p.name}">&minus;</button>
          <span>${qty}</span>
          <button type="button" data-cart-inc="${p.id}" aria-label="Increase quantity of ${p.name}">+</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" data-cart-remove="${p.id}" aria-label="Remove ${p.name} from bag">
        <i class="fas fa-trash-alt" aria-hidden="true"></i>
      </button>
    </div>`
    )
    .join('');

  const subtotal = cartSubtotal();
  const shipping = shippingCost(subtotal);
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  if (subtotalEl) subtotalEl.textContent = money(subtotal);
  if (shippingEl) shippingEl.textContent = shipping > 0 ? money(shipping) : 'Free';

  // Checkout = WhatsApp order (brand rule: mock checkout, no payment gateway)
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    const lines = items.map(
      ({ product: p, qty }) => `${p.name} ${p.variant} × ${qty} = ${money(p.price * qty)}`
    );
    const message = [
      'Hello PENDOOROOTS! I would like to place an order:',
      '',
      ...lines,
      '',
      `Subtotal: ${money(subtotal)}`,
      `Shipping: ${shipping > 0 ? money(shipping) : 'Free'}`,
      `Total: ${money(subtotal + shipping)}`,
    ].join('\n');
    checkoutBtn.setAttribute(
      'href',
      `https://wa.me/923474736347?text=${encodeURIComponent(message)}`
    );
  }
}

function renderWishlistSidebar(): void {
  const wrap = document.getElementById('wishlistItems');
  const footer = document.getElementById('wishlistFooter');
  if (!wrap) return;
  const items = getWishlistItems();

  if (!items.length) {
    wrap.innerHTML =
      '<div class="cart-empty"><i class="fas fa-heart" aria-hidden="true"></i><p>Your wishlist is empty</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = '';

  wrap.innerHTML = items
    .map(
      (p) => `
    <div class="cart-item-sidebar">
      <div class="cart-item-sidebar-img"><img src="${p.image}" alt="${p.name}" width="80" height="80" loading="lazy" /></div>
      <div class="cart-item-sidebar-info">
        <div class="cart-item-sidebar-name">${p.name} · ${p.variant}</div>
        <div class="cart-item-sidebar-price">${money(p.price)}</div>
        <button type="button" class="wishlist-move-btn" data-wish-to-cart="${p.id}">
          <i class="fas fa-shopping-bag" aria-hidden="true"></i> Add to bag
        </button>
      </div>
      <button type="button" class="cart-item-remove" data-wish-remove="${p.id}" aria-label="Remove ${p.name} from wishlist">
        <i class="fas fa-trash-alt" aria-hidden="true"></i>
      </button>
    </div>`
    )
    .join('');
}

/* sidebar open/close (module scope — shared by nav toggles & action handlers) */

function openCartSidebar(): void {
  document.getElementById('cartSidebar')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
  renderCartSidebar();
}

function closeCartSidebar(): void {
  document.getElementById('cartSidebar')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

function openWishlistSidebar(): void {
  document.getElementById('wishlistSidebar')?.classList.add('active');
  document.getElementById('wishlistOverlay')?.classList.add('active');
  renderWishlistSidebar();
}

function closeWishlistSidebar(): void {
  document.getElementById('wishlistSidebar')?.classList.remove('active');
  document.getElementById('wishlistOverlay')?.classList.remove('active');
}

function initCart(): void {
  document.getElementById('cartToggle')?.addEventListener('click', openCartSidebar);
  document.getElementById('cartClose')?.addEventListener('click', closeCartSidebar);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartSidebar);
  document.getElementById('wishlistToggle')?.addEventListener('click', openWishlistSidebar);
  document.getElementById('wishlistClose')?.addEventListener('click', closeWishlistSidebar);
  document.getElementById('wishlistOverlay')?.addEventListener('click', closeWishlistSidebar);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartSidebar();
      closeWishlistSidebar();
    }
  });
}

/** Single delegated listener — works for cards, product page & sidebar rows. */
function initShopActions(): void {
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const action = e.target.closest<HTMLElement>(
      '[data-add-to-cart],[data-wishlist-toggle],[data-quick-view],' +
        '[data-cart-inc],[data-cart-dec],[data-cart-remove],' +
        '[data-wish-remove],[data-wish-to-cart]'
    );
    if (!action) return;
    // Action buttons may sit inside links — always swallow the click
    e.preventDefault();
    e.stopPropagation();

    const idOf = (name: string): number => Number(action.getAttribute(name));

    // ── Add to bag ──
    if (action.hasAttribute('data-add-to-cart')) {
      const product = getProduct(idOf('data-add-to-cart'));
      if (!product) return;
      addToCart(product.id);
      showToast(`${product.name} ${product.variant} added to your bag`);
      if (action.hasAttribute('data-open-cart')) openCartSidebar();
      return;
    }

    // ── Wishlist toggle (cards + product page) ──
    if (action.hasAttribute('data-wishlist-toggle')) {
      const product = getProduct(idOf('data-wishlist-toggle'));
      if (!product) return;
      const added = toggleWishlist(product.id);
      showToast(
        added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`,
        added ? 'success' : 'info'
      );
      return;
    }

    // ── Quick view → product page ──
    if (action.hasAttribute('data-quick-view')) {
      const product = getProduct(idOf('data-quick-view'));
      if (product) window.location.href = `/shop/${product.slug}`;
      return;
    }

    // ── Cart quantity steppers ──
    if (action.hasAttribute('data-cart-inc')) {
      const id = idOf('data-cart-inc');
      const line = getCart().find((l) => l.id === id);
      if (line) setCartQty(id, line.qty + 1);
      return;
    }
    if (action.hasAttribute('data-cart-dec')) {
      const id = idOf('data-cart-dec');
      const line = getCart().find((l) => l.id === id);
      if (line) setCartQty(id, line.qty - 1);
      return;
    }
    if (action.hasAttribute('data-cart-remove')) {
      removeFromCart(idOf('data-cart-remove'));
      showToast('Removed from your bag', 'info');
      return;
    }

    // ── Wishlist sidebar actions ──
    if (action.hasAttribute('data-wish-remove')) {
      removeFromWishlist(idOf('data-wish-remove'));
      showToast('Removed from wishlist', 'info');
      return;
    }
    if (action.hasAttribute('data-wish-to-cart')) {
      const product = getProduct(idOf('data-wish-to-cart'));
      if (!product) return;
      addToCart(product.id);
      removeFromWishlist(product.id);
      showToast(`${product.name} moved to your bag`);
      openCartSidebar();
      return;
    }
  });
}

/** Re-sync every shop surface after any store mutation. */
function syncShopUI(): void {
  updateBadges();
  syncWishlistButtons();
  renderCartSidebar();
  renderWishlistSidebar();
}

function initShop(): void {
  onStoreChange(syncShopUI);
  syncShopUI();
  initShopActions();
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
  const scroller: HTMLElement = track;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let scrollPos = 0;
  function autoScroll(): void {
    scrollPos += 0.5;
    if (scrollPos >= scroller.scrollWidth - scroller.clientWidth) scrollPos = 0;
    scroller.scrollLeft = scrollPos;
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);
}

// Social Proof block — auto-cycling testimonial cards with dot navigation
function initSocialProof(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>('[data-social-proof]').forEach((section) => {
    const track = section.querySelector<HTMLElement>('#socialProofTrack');
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.social-proof-card'));
    const dots = Array.from(section.querySelectorAll<HTMLElement>('.social-proof-dot'));
    const intervalMs = Number(section.getAttribute('data-interval')) || 5000;

    if (cards.length === 0) return;
    if (prefersReducedMotion) {
      cards.forEach((c) => {
        c.style.position = 'static';
        c.style.opacity = '1';
        c.style.pointerEvents = 'auto';
        c.style.marginBottom = '24px';
      });
      return;
    }

    let current = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const show = (index: number): void => {
      cards.forEach((c) => {
        c.classList.remove('active');
        c.style.position = 'absolute';
        c.style.inset = '0';
        c.style.opacity = '0';
        c.style.pointerEvents = 'none';
      });
      dots.forEach((d) => {
        d.classList.remove('active');
        d.setAttribute('aria-pressed', 'false');
      });
      const card = cards[index];
      const dot = dots[index];
      if (card) {
        card.classList.add('active');
        card.style.position = 'relative';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      }
      if (dot) {
        dot.classList.add('active');
        dot.setAttribute('aria-pressed', 'true');
      }
    };

    const next = (): void => {
      current = (current + 1) % cards.length;
      show(current);
    };

    const reset = (): void => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(next, intervalMs);
    };

    show(current);
    reset();

    section.addEventListener('mouseenter', () => {
      if (timer) clearTimeout(timer);
      timer = null;
    });
    section.addEventListener('mouseleave', reset);

    dots.forEach((d) => {
      d.addEventListener('click', () => {
        const idx = Number(d.getAttribute('data-dot'));
        if (!Number.isNaN(idx)) {
          current = idx;
          show(current);
          reset();
        }
      });
    });
  });
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
  initShop();
  initNavigation();
  initRevealAnimations();
  initCounters();

  // Heavy initializations (delayed)
  setTimeout(() => {
    initCursor();
    initHeroParticles();
    initHeroSparkles();
    initTestimonialScroll();
    initSocialProof();
  }, 2500);
});

// Export for global access (legacy compatibility)
window.formatRs = (n: number) => 'Rs.' + new Intl.NumberFormat('en-PK').format(n);
window.showToast = showToast;
