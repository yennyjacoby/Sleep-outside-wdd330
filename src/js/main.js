// main.js
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

/*

Commented out so src/index only shows the product categories.
Uncomment this block to show the tents list on the home page again (src/index.html)

// initialize product list
const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const tentList = new ProductList("tents", dataSource, listElement);
tentList.init();

*/