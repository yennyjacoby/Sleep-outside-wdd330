// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  if (key === "so-cart") updateCartCount(); // keep header badge in sync
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render list with template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render single template with optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// load template file from path via fetch
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`);
  }
  const template = await res.text();
  return template;
}

// load header and footer templates into DOM
export async function loadHeaderFooter() {
  const headerElement = document.querySelector("#main-header");
  if (headerElement) {
    const headerTemplate = await loadTemplate("/partials/header.html");
    renderWithTemplate(headerTemplate, headerElement);
    updateCartCount();
  }

  const footerElement = document.querySelector("#main-footer");
  if (footerElement) {
    const footerTemplate = await loadTemplate("/partials/footer.html");
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// show total items in cart as a superscript number on the cart icon
export function updateCartCount() {
  const badge = document.querySelector("#cart-count");
  if (!badge) return; // page has no header badge
  const items = getLocalStorage("so-cart") || [];
  const count = items.reduce((sum, item) => sum + (item.Quantity || item.quantity || 1), 0); // quantity if set, else 1 each
  badge.textContent = count;
  badge.hidden = count === 0; // hide badge when cart is empty
}

// display a dismissible alert banner at the top of <main>
export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");
  if (!main) return;

  const existingAlert = main.querySelector(".alert-message");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.className = "alert-message";
  alert.setAttribute("role", "alert");

  const text = document.createElement("p");
  text.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "alert-message__close";
  closeBtn.setAttribute("aria-label", "Close alert");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    alert.remove();
  });

  alert.append(text, closeBtn);
  main.prepend(alert);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}