import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// zip, card number, and cvv: only digits
["#zip", "#cardNumber", "#code"].forEach((selector) => {
  const input = document.querySelector(selector);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
});

// expiration date: only digits, with "/"
const expiration = document.querySelector("#expiration");
expiration.addEventListener("input", () => {
  let v = expiration.value.replace(/\D/g, "").slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
  expiration.value = v;
});

// listening for click on the button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms["checkout"];
  const chkStatus = myForm.checkValidity();
  myForm.reportValidity();
  if (chkStatus) {
    order.checkout();
  }
});