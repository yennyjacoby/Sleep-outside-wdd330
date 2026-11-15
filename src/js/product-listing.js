import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

export function renderProductList(productType = "tents") {
  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const title = document.querySelector(".title-highlight");

  if (!listElement) {
    throw new Error("Product list element was not found.");
  }

  const inventoryList = new ProductList(productType, dataSource, listElement);
  inventoryList.init();

  if (title) {
    title.textContent =
      productType.charAt(0).toUpperCase() + productType.slice(1);
  }
}

if (document.body.dataset.page === "product-listing") {
  loadHeaderFooter();
  renderProductList(getParam("category") ?? "tents");
}
