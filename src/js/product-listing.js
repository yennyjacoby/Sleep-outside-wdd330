import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const productType = getParam("category");
const listElement = document.querySelector(".product-list");
const title = document.getElementById("category-title");
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

if (categories.includes(productType)) {
  const dataSource = new ProductData();
  const inventoryList = new ProductList(productType, dataSource, listElement);
  inventoryList.init();
} else {
  title.textContent = "Choose a product category";
  listElement.innerHTML = `<li class="cart-empty">
    <p role="alert">Select a category from the home page to see its products.</p>
  </li>`;
}