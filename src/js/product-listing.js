import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Create an instance of ProductData for tents
const dataSource = new ProductData("tents");

// Select the product list element from the DOM
const listElement = document.querySelector(".product-list");

// Create an instance of ProductList and initialize it
const tentList = new ProductList("tents", dataSource, listElement);
tentList.init();