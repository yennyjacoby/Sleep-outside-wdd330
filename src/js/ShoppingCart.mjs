import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const image = item.Images?.PrimaryMedium || item.Image;
  const quantity = item.Quantity || 1;

  return `<li class="cart-card divider">
  <span class="remove-item cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
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
    }

    this.renderTotal(cartItems);
  }

  removeItem(id) {
    const cartItems = getLocalStorage(this.key) || [];
    const index = cartItems.findIndex((item) => item.Id === id);

    if (index !== -1) {
      if ((cartItems[index].Quantity || 1) > 1) {
        cartItems[index].Quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
    }

    setLocalStorage(this.key, cartItems);
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