// main.js
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
// import Alert from "./alert.js";

// new Alert();

loadHeaderFooter();

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const tentList = new ProductList("tents", dataSource, listElement);
tentList.init();