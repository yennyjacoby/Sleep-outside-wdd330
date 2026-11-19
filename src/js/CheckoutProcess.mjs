

export default class CheckoutProcess {
    // key should be "so-cart"
    // the outputSelector is grabbing the class/id of where all the info is going.
    constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSubTotal() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );
    itemNumElement.innerText = this.list.length;
    // calculate the total of all the items in the cart
    // below line creates an array with the finalPrices
    const amounts = this.list.map((item) => item.FinalPrice);
    // below line takes the new list and makes the itemTotal the sum of all the finalPrices
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.innerText = `$${this.itemTotal}`;
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = (this.itemTotal * .06)
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = (
        parseFloat(this.itemTotal) +
        parseFloat(this.tax) +
        parseFloat(this.shipping)
    )

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}