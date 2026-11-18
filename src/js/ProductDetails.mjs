// wrapper for querySelector...returns matching element
// export function qs(selector, parent = document) {
//     return parent.querySelector(selector);
// }
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
// export function getLocalStorage(key) {
//     return JSON.parse(localStorage.getItem(key));
// }
// save data to local storage
// export function setLocalStorage(key, data) {
//     localStorage.setItem(key, JSON.stringify(data));
// }
// set a listener for both touchend and click
// export function setClick(selector, callback) {
//     qs(selector).addEventListener("touchend", (event) => {
//         event.preventDefault();
//         callback();
//     });
//     qs(selector).addEventListener("click", callback);
// }

// get parameter from URL
// export function getParam(param) {
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     return urlParams.get(param);
// }


// When I tried npm run build, it was popping up errors with this page, so I went to the example of what we are supposed to do and it looks nothing like this, so I am copy and pasting that code.

import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    if (!this.productId) {
      this.showProductNotFound();
      return;
    }

    try {
      this.product = await this.dataSource.findProductById(this.productId);
    } catch (error) {
      console.error("Failed to load product details:", error);
      this.showProductError();
      return;
    }

    if (!this.product) {
      this.showProductNotFound();
      return;
    }

    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  showProductNotFound() {
    document.querySelector(".product-detail").textContent = "Product not found.";
  }

  showProductError() {
    document.querySelector(".product-detail").textContent =
      "Product details could not be loaded. Please try again later.";
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const existingItem = cartItems.find(
      (item) => item.Id === this.product.Id
      );
    if (existingItem) {
      existingItem.Quantity += 1;
    } else {
      cartItems.push({ ...this.product, Quantity: 1 });
    }
    
    
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  const brand = typeof product.Brand === "object"
    ? product.Brand.Name
    : product.Brand;

  document.querySelector("#p-brand").textContent = brand || "";
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;
  document.title = `${product.Name} | Sleep Outside`;

  document.getElementById('productColor').textContent =
    product.Colors?.[0]?.ColorName || "";
  document.getElementById('productDesc').innerHTML =
    product.DescriptionHtmlSimple || "";
  document.getElementById('addToCart').dataset.id = product.Id;

  const productImage = document.getElementById('productImage');
  productImage.src = product.Images?.PrimaryLarge || product.Image || "";
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productPrice').textContent = product.FinalPrice;
  const discountElement = document.getElementById("productDiscount");
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const savings = product.SuggestedRetailPrice - product.FinalPrice;
    const discountPercent = Math.round((savings / product.SuggestedRetailPrice) * 100);

    discountElement.textContent = `save ${discountPercent}%`;
    discountElement.hidden = false;
  } else {
    discountElement.hidden = true;
  }
}