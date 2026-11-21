
// main.js
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load the shared header and footer
loadHeaderFooter();

// Initialize the registration promotion
function initRegistrationPromo() {
  const promo = document.querySelector("#register-promo");

  // Stop if the registration modal doesn't exist on this page
  if (!promo) return;

  const storageKey = "sleepOutsideRegisterPromoSeen";

  // Check whether the visitor has already seen the promotion
  if (localStorage.getItem(storageKey)) return;

  // Display the modal
  promo.showModal();

  // Remember that the visitor has seen the promotion
  function markAsSeen() {
    localStorage.setItem(storageKey, "true");
  }

  // Close button
  const closeButton = promo.querySelector(".register-promo-close");

  closeButton.addEventListener("click", () => {
    promo.close();
  });

  // Maybe later button
  const dismissButton = promo.querySelector(".register-promo-dismiss");

  dismissButton.addEventListener("click", () => {
    promo.close();
  });

  // Register Now link
  const registerButton = promo.querySelector(".register-promo-button");

  registerButton.addEventListener("click", markAsSeen);

  // Remember dismissal, including Escape key and other close actions
  promo.addEventListener("close", markAsSeen);

  // Close when the visitor clicks outside the modal
  promo.addEventListener("click", (event) => {
    if (event.target === promo) {
      promo.close();
    }
  });
}

// Run the registration promotion
initRegistrationPromo();

// Existing product listing functionality
const dataSource = new ExternalServices("tents");
const listElement = document.querySelector(".product-list");
const tentList = new ProductList("tents", dataSource, listElement);
tentList.init();
