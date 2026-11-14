import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Grab the category from the URL query parameter (e.g., ?category=backpacks)
const category = getParam("category");

// Dynamically update the heading title based on the selected category
if (category) {
    const titleElement = document.querySelector("#product-list-title");
    const formattedCategory = category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    titleElement.textContent = `Top Products: ${formattedCategory}`;
}

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

// Pass the dynamic category into ProductList instead of hardcoding "tents"
const myList = new ProductList(category, dataSource, listElement);
myList.init();