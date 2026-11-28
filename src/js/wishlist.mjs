import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const KEY = "so-wishlist";

// Saves a product to the wish list. Skips it if it is already there,
// so the same product can't be added twice.
export function addToWishlist(product) {
  const list = getLocalStorage(KEY) || [];
  if (!list.some((item) => item.Id === product.Id)) {
    list.push(product);
    setLocalStorage(KEY, list);
  }
}
// Removes the product with the given id from the wish list.
export function removeFromWishlist(id) {
  const list = (getLocalStorage(KEY) || []).filter((item) => item.Id !== id);
  setLocalStorage(KEY, list);
}

// Moves a product from the wish list to the cart.
// If it is already in the cart, adds 1 to its quantity instead of duplicating it.
export function moveToCart(id) {
  const list = getLocalStorage(KEY) || [];
  const product = list.find((item) => item.Id === id);
    if (!product) return;
    
  const cart = getLocalStorage("so-cart") || [];
  const existing = cart.find((item) => item.Id === id);
  if (existing) {
    existing.Quantity += 1;
  } else {
    cart.push({ ...product, Quantity: 1 }); // the cart needs a Quantity field
  }
  setLocalStorage("so-cart", cart);

  removeFromWishlist(id); // once it is in the cart, it leaves the wish list
}