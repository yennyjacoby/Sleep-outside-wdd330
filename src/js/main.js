import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// 1. Create an instance of ProductData for tents
const dataSource = new ProductData("tents");

// 2. Select the product list element from the DOM (index.html)
const listElement = document.querySelector(".product-list");

// 3. Create an instance of ProductList
const tentList = new ProductList("tents", dataSource, listElement);

// 4. Initialize the product list rendering
tentList.init();