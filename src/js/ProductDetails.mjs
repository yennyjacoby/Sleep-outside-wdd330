import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Fetch product details directly from the API by ID
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  const brand = typeof product.Brand === "object" ? product.Brand.Name : product.Brand;

  document.querySelector('h2').textContent = brand;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  // Fix: Use PrimaryLarge from the API image structure
  const imageUrl = product.Images ? product.Images.PrimaryLarge : product.Image;
  productImage.src = imageUrl;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productPrice').textContent = product.FinalPrice;

  // Calculate discount percentage if suggested retail price exists and is higher
  const discountElement = document.getElementById('productDiscount');
  if (product.SuggestedRetailPrice && product.SuggestedRetailPrice > product.FinalPrice) {
    const savings = product.SuggestedRetailPrice - product.FinalPrice;
    const discountPercent = Math.round((savings / product.SuggestedRetailPrice) * 100);

    discountElement.textContent = `save ${discountPercent}%`;
    discountElement.hidden = false;
  }

  document.getElementById('productColor').textContent = product.Colors && product.Colors.length > 0 ? product.Colors[0].ColorName : '';
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
  document.getElementById('addToCart').dataset.id = product.Id;
}