import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    const brand = typeof product.Brand === "object" ? product.Brand.Name : product.Brand;

    // Calculate discount percentage if suggested retail price exists and is higher
    let discountBadge = "";
    if (product.SuggestedRetailPrice && product.SuggestedRetailPrice > product.FinalPrice) {
        const savings = product.SuggestedRetailPrice - product.FinalPrice;
        const discountPercent = Math.round((savings / product.SuggestedRetailPrice) * 100);
        discountBadge = `<span class="discount-badge">Save ${discountPercent}%</span>`;
    }

    return `<li class="product-card">
        <a href="../product_pages/?product=${product.Id}">
        ${discountBadge}
        <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
    </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);

        const title = document.getElementById("category-title");
        //Capitalizes the first letter and replace the hyphen with a space (e.g. "sleeping-bags" -> "Sleeping bags")
        const name = this.category.replace("-", " ");
        title.textContent = `Top Products: ${name.charAt(0).toUpperCase() + name.slice(1)}`; 
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}