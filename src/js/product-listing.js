import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, renderBreadcrumb } from "./utils.mjs";

loadHeaderFooter();

const productType = getParam("category");
const listElement = document.querySelector(".product-list");
const title = document.getElementById("category-title");
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

// render breadcrumb trail for the listing page
const formattedCategory = productType
  ? productType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  : "Products";
renderBreadcrumb([
  { label: "Home", url: "/index.html" },
  { label: formattedCategory },
]);

if (categories.includes(productType)) {
  const dataSource = new ExternalServices();
  const inventoryList = new ProductList(productType, dataSource, listElement);
  inventoryList.init();
} else {
  title.textContent = "Choose a product category";
  listElement.innerHTML = `<li class="cart-empty">
    <p role="alert">Select a category from the home page to see its products.</p>
  </li>`;
}