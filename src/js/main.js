
// This imports the ProductData stuff
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// this calls ProductData and gives it the necessary info to parse the tents.json file.
// That data is turned into a variable which is then used in the ProductList class.
const dataSource = new ProductData("tents");

// this grabs the element on the html file that is supposed to be changed around from the json file data.
const element = document.querySelector(".product-list");

// this calls the imported class  with the necessary data to make the product cards on the html file.
const productList = new ProductList("Tents", dataSource, element);

// this then runs the imported class so that it will actually make the product cards
productList.init();