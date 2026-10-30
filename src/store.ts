/**
 * PENDOOROOTS — Client-side cart & wishlist store
 *
 * Persistence: localStorage (`pr_cart` / `pr_wishlist`)
 * Tiny pub/sub so every UI surface (badges, sidebars, card hearts)
 * stays in sync after any mutation.
 */
import { products } from '@/data/products';
import type { Product } from '@/data/products';

export interface CartLine {
  id: number;
  qty: number;
}

const CART_KEY = 'pr_cart';
const WISHLIST_KEY = 'pr_wishlist';
const MAX_QTY = 99;
const FREE_SHIPPING_MIN = 1000; // Rs.1000+
const FLAT_SHIPPING = 100;

/* ── persistence helpers ── */

function load(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / private mode — in-memory state still works this session */
  }
}

/* ── pub/sub ── */

type Listener = () => void;
const listeners = new Set<Listener>();

export function onStoreChange(fn: Listener): void {
  listeners.add(fn);
}

function emit(): void {
  listeners.forEach((fn) => fn());
}

/* ── product lookup ── */

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

/* ── cart ── */

function sanitizeCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<number, number>();
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const id = (entry as CartLine).id;
    const qty = (entry as CartLine).qty;
    if (typeof id !== 'number' || !getProduct(id)) continue;
    const q = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(qty) || 1)));
    merged.set(id, (merged.get(id) ?? 0) + q);
  }
  return Array.from(merged, ([id, qty]) => ({ id, qty }));
}

export function getCart(): CartLine[] {
  return sanitizeCart(load(CART_KEY));
}

export function addToCart(id: number, qty = 1): void {
  if (!getProduct(id)) return;
  const cart = getCart();
  const line = cart.find((l) => l.id === id);
  if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
  else cart.push({ id, qty: Math.max(1, Math.min(MAX_QTY, qty)) });
  save(CART_KEY, cart);
  emit();
}

export function setCartQty(id: number, qty: number): void {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((l) => l.id !== id);
  } else {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty = Math.min(MAX_QTY, Math.floor(qty));
  }
  save(CART_KEY, cart);
  emit();
}

export function removeFromCart(id: number): void {
  setCartQty(id, 0);
}

export function getCartItems(): Array<{ product: Product; qty: number }> {
  return getCart()
    .map((line) => {
      const product = getProduct(line.id);
      return product ? { product, qty: line.qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);
}

export function cartCount(): number {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

export function cartSubtotal(): number {
  return getCartItems().reduce((sum, { product, qty }) => sum + product.price * qty, 0);
}

/** Free shipping over Rs.1000, else Rs.100 (brand rule). */
export function shippingCost(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : FLAT_SHIPPING;
}

/* ── wishlist ── */

function sanitizeWishlist(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set<number>();
  for (const id of raw) {
    if (typeof id === 'number' && getProduct(id)) ids.add(id);
  }
  return Array.from(ids);
}

export function getWishlist(): number[] {
  return sanitizeWishlist(load(WISHLIST_KEY));
}

export function isInWishlist(id: number): boolean {
  return getWishlist().includes(id);
}

/** Toggle a product in the wishlist. Returns true when now wishlisted. */
export function toggleWishlist(id: number): boolean {
  if (!getProduct(id)) return false;
  const wish = getWishlist();
  const idx = wish.indexOf(id);
  let added: boolean;
  if (idx >= 0) {
    wish.splice(idx, 1);
    added = false;
  } else {
    wish.push(id);
    added = true;
  }
  save(WISHLIST_KEY, wish);
  emit();
  return added;
}

export function removeFromWishlist(id: number): void {
  save(WISHLIST_KEY, getWishlist().filter((x) => x !== id));
  emit();
}

export function getWishlistItems(): Product[] {
  return getWishlist()
    .map((id) => getProduct(id))
    .filter((p): p is Product => p !== undefined);
}
