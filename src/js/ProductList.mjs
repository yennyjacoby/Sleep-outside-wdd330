import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    const brand = typeof product.Brand === "object"
        ? product.Brand.Name
        : product.Brand;

    let discountBadge = "";

    if (
        product.SuggestedRetailPrice &&
        product.SuggestedRetailPrice > product.FinalPrice
    ) {
        const savings = product.SuggestedRetailPrice - product.FinalPrice;
        const discountPercent = Math.round(
            (savings / product.SuggestedRetailPrice) * 100
        );

        discountBadge = `<span class="discount-badge">Save ${discountPercent}%</span>`;
    }

    return `
        <li class="product-card">
            <a href="product_pages/?product=${product.Id}">
                ${discountBadge}
                <img src="${product.Image}" alt="Image of ${product.Name}">
                <h3 class="card__brand">${brand}</h3>
                <h2 class="card__name">${product.NameWithoutBrand}</h2>
                <p class="product-card__price">$${product.FinalPrice}</p>
            </a>

            <button 
                type="button"
                class="quick-view-btn"
                data-product-id="${product.Id}">
                Quick View
            </button>
        </li>
    `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);

    this.listElement.addEventListener("click", (event) => {
        const button = event.target.closest(".quick-view-btn");

        if (!button) return;

        event.preventDefault();
        this.showQuickView(button.dataset.productId);
    });

    const dialog = document.getElementById("quick-view-dialog");

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

    renderList(list) {
        renderListWithTemplate(
            productCardTemplate,
            this.listElement,
            list
        );
    }

    async showQuickView(productId) {
        const product = await this.dataSource.findProductById(productId);

        if (!product) return;

        const brand = typeof product.Brand === "object"
            ? product.Brand.Name
            : product.Brand;

        const dialog = document.getElementById("quick-view-dialog");

        dialog.innerHTML = `
            <div class="quick-view-content">
                <button 
                    type="button" 
                    class="quick-view-close"
                    aria-label="Close dialog">
                    &times;
                </button>

                <img src="${product.Image}" alt="${product.NameWithoutBrand}">

                <div class="quick-view-info">
                    <h2>${brand}</h2>
                    <h3>${product.NameWithoutBrand}</h3>
                    <p class="quick-view-price">$${product.FinalPrice}</p>
                    <p>${product.Colors?.[0]?.ColorName || "Colour not specified"}</p>
                    <div class="quick-view-description">
                        ${product.DescriptionHtmlSimple || "No description available."}
                    </div>
                </div>
            </div>
        `;

        dialog.showModal();

        dialog.querySelector(".quick-view-close").addEventListener("click", () => {
            dialog.close();
        });
    }
}
