import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Create an instance of ProductData for tents
const dataSource = new ProductData();
const productType = getParam("category");

// Select the product list element from the DOM
const listElement = document.querySelector(".product-list");

// Create an instance of ProductList and initialize it
const inventoryList = new ProductList(productType, dataSource, listElement);
inventoryList.init();

const title = document.querySelector(".title-highlight");

console.log(productType);
title.textContent = productType.charAt(0).toUpperCase() + productType.slice(1);