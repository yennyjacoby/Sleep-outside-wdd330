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
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");

  const text = document.createElement("p");
  text.textContent = message;
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "X";
  close.setAttribute("aria-label", "Dismiss message");
  close.addEventListener("click", () => alert.remove());
  alert.append(text, close);

  const main = qs("main");
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  document.querySelectorAll(".alert").forEach((alert) => alert.remove());
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
  }

  const footerElement = document.querySelector("#main-footer");
  if (footerElement) {
    const footerTemplate = await loadTemplate("/partials/footer.html");
    renderWithTemplate(footerTemplate, footerElement);
  }
}