import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const image = item.Images?.PrimaryMedium || item.Image;
  const quantity = item.Quantity || 1;

// Added - / + buttons for the cart 

  return `<li class="cart-card divider">
  <span class="remove-item cart-card__remove" data-id="${item.Id}">X</span>
  <a href="../product_pages/index.html?product=${encodeURIComponent(item.Id)}" class="cart-card__image">
    <img src="${image}" alt="${item.Name}" />
  </a>
  <a href="../product_pages/index.html?product=${encodeURIComponent(item.Id)}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <div class="cart-card__quantity">
    <button class="qty-btn" data-id="${item.Id}" data-delta="-1" aria-label="Decrease quantity">−</button>
    <span>${quantity}</span>
    <button class="qty-btn" data-id="${item.Id}" data-delta="1" aria-label="Increase quantity">+</button>
  </div>
  <p class="cart-card__price">
    $${(item.FinalPrice * quantity).toFixed(2)}
  </p>
</li>`;
}

function emptyCartTemplate() {
  return `<li class="cart-empty">
    <p>⛺ Your cart is empty.</p>
    <a href="/index.html" class="cart-empty__link">Continue shopping</a>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  renderCart() {
    const cartItems = getLocalStorage(this.key) || [];
    const parentElement = document.querySelector(this.parentSelector);

    if (cartItems.length === 0) {
      parentElement.innerHTML = emptyCartTemplate();
    } else {
      renderListWithTemplate(cartItemTemplate, parentElement, cartItems, "afterbegin", true);

      parentElement.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", (e) => this.removeItem(e.target.dataset.id));
      });

      parentElement.querySelectorAll(".qty-btn").forEach((btn) => {
        btn.addEventListener("click", (e) =>
          this.changeQuantity(e.target.dataset.id, Number(e.target.dataset.delta))
        );
      });
    }

    this.renderTotal(cartItems);
  }

// Add changeQuantity to update item quantity in localstorage and remove the item when the quantity is 0
  changeQuantity(id, delta) {
    const cartItems = getLocalStorage(this.key) || [];
    const item = cartItems.find((item) => item.Id === id);
    if (!item) return;

    item.Quantity = (item.Quantity || 1) + delta;

    const updated = cartItems.filter((item) => item.Quantity > 0);
    setLocalStorage(this.key, updated);
    this.renderCart();
  }

  removeItem(id) {
    const cartItems = getLocalStorage(this.key) || [];
    const updated = cartItems.filter((item) => item.Id !== id);

    setLocalStorage(this.key, updated);
    this.renderCart();
  }

  renderTotal(cartItems) {
    const cartFooter = document.querySelector(".cart-footer");
    const cartTotal = document.querySelector(".cart-total");
    if (!cartFooter || !cartTotal) return;

    if (cartItems.length > 0) {
      const total = cartItems.reduce(
        (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
        0
      );
      cartFooter.classList.remove("hide");
      cartTotal.textContent = `Total $${total.toFixed(2)}`;
    } else {
      cartFooter.classList.add("hide");
      cartTotal.textContent = "";
    }
  }
}