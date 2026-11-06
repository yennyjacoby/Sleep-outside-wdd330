import { renderListWithTemplate } from "./utils.mjs";


// this is a function to create the card template
function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="product_pages/?product=">
    <img src="" alt="Image of ">
    <h2 class="card_brand"></h2>
    <h3 class="card_name"></h3>
    <p class="product-card_price">$</p>
    </a>
    </li>`
}




// this adds a class with the same title as the file and makes it the default and exports it.
export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        // the list is the json data for tents. it gets called from main, which calls the json data from ProductData
        const list = await this.dataSource.getData();
        // this calls the function at the top when this class is called upon
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list)
    }
}