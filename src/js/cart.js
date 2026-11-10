import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Update the cart total whenever the cart contents are rendered.
  calculateTotalCart(cartItems);

  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // console.log("Remove button clicked!");
      // this grabs the data-id from the item button, which is the id of the product.
      const productId = button.getAttribute("data-id");
      // console.log(`${productId}`)
      // this grabs so-cart
      const cartArray = getLocalStorage("so-cart");
      // console.log(cartArray);
      // these two things grab the index of the first product that matches the id, and then removes it.
      const index = cartArray.findIndex((product) => product.Id === productId);
      if(index >= 0) {
      cartArray.splice(index, 1);
      }

      // this resets the initial local storage array to have the item removed.
      setLocalStorage("so-cart", cartArray);

      renderCartContents()
    });
  }); 
}

// Calculates and displays the cart total.
// Shows the cart footer when items exist and hides it when the cart is empty.
function calculateTotalCart(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cartItems.length > 0) {
    // Calculate the total price of all products in the cart.
    const inicialValue = 0;
    const sumAllProducts = cartItems.reduce((accumulator, currentValue) => accumulator + currentValue.FinalPrice, inicialValue);
    // Display the cart footer and update the total amount.
    cartFooter.classList.remove("hide");
    cartTotal.textContent = `Total $${sumAllProducts}`;
  } else {
    // Hide the cart footer and clear the previous total.
    cartFooter.classList.add("hide");
    cartTotal.textContent = ``;
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="remove-item" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
