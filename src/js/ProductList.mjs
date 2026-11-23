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

    return `<li class="product-card">
        <a href="../product_pages/?product=${product.Id}">
        ${discountBadge}
        <picture>
            <source
                media="(min-width: 1200px)"
                srcset="${product.Images.PrimaryExtraLarge}">
            <source
                media="(min-width: 768px)"
                srcset="${product.Images.PrimaryLarge}">
            <source
                media="(min-width: 480px)"
                srcset="${product.Images.PrimaryMedium}">
            <img
                src="${product.Images.PrimarySmall}"
                alt="Image of ${product.Name}">
        </picture>
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
        let list;
        try {
            list = await this.dataSource.getData(this.category);
        } catch (error) {
            console.error("Failed to load product list:", error);
            this.listElement.innerHTML = `<li class="cart-empty">
                <p role="alert">Products could not be loaded. Please try again later.</p>
            </li>`;
            return;
        }

        this.renderList(list);

        const sortOption = document.querySelector("#sort-by");
        // Added "if" to avoid error in console when sortOption is null
        if (sortOption) {
            sortOption.addEventListener("change", (e) => {
                const sortList = [...list];
                // console.log(e.target.value);
                if (e.target.value === "name") {
                    let newList = sortList.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
                    this.renderList(newList);
                } else if (e.target.value === "price") {
                    const sortList = [...list];
                    let newList = sortList.sort((a, b) => a.FinalPrice - b.FinalPrice);
                    this.renderList(newList);
                } else if (e.target.value === "default") {
                    this.renderList(list);
                }
            });
        }

        const title = document.getElementById("category-title");
        if (title && this.category) {
            const name = this.category.replace("-", " ");
            title.textContent = `Top Products: ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        }
    }

    renderList(list) {
        renderListWithTemplate(
            productCardTemplate,
            this.listElement,
            list,
            "afterbegin",
            true
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

                <picture>
                    <source
                        media="(min-width: 1200px)"
                        srcset="${product.Images.PrimaryExtraLarge}">
                    <source
                        media="(min-width: 1000px)"
                        srcset="${product.Images.PrimaryLarge}">
                    <source
                        media="(min-width: 600px)"
                        srcset="${product.Images.PrimaryMedium}">
                    <img
                        src="${product.Images.PrimarySmall}"
                        alt="${product.NameWithoutBrand}">
                </picture>                

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
