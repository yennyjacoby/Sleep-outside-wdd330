import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import { removeFromWishlist, moveToCart } from "./wishlist.mjs";


// Draws the wish list inside <ul class="product-list">.
// Called on page load and again after every change.
function renderWishlist() {
  const list = getLocalStorage("so-wishlist") || [];
  const el = document.querySelector(".product-list");
  el.innerHTML = list.length
    ? list.map((p) => `
        <li class="cart-card divider">
            <picture class="cart-card__image">
                <source
                    media="(min-width: 500px)"
                    srcset="${p.Images?.PrimaryMedium || ""}">
                <img
                    src="${p.Images?.PrimarySmall || p.Image || ""}"
                    alt="Image of ${p.Name}">
            </picture>
            <h3 class="card__name">${p.NameWithoutBrand}</h3>
            <button class="to-cart" data-id="${p.Id}">Move to Cart</button>
            <p class="cart-card__price">$${p.FinalPrice}</p>
            <span class="remove-item remove" data-id="${p.Id}">X</span>
        </li>`).join("")
    : `<li class="cart-empty">
        Your wish list is empty.<br />
        <a class="cart-empty__link" href="/index.html">Keep shopping</a>
    </li>`;
}

document.querySelector(".product-list").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains("to-cart")) moveToCart(id);
  if (e.target.classList.contains("remove")) removeFromWishlist(id);
  renderWishlist();
});

renderWishlist();
loadHeaderFooter();