export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // filters
    this.model.bindFiltersChanged(this.onFiltersChanged);
    // this.model.updateFilters({ searchStr: "hi" });
    // filters

    // init
    // this.view.fillCategoryList(this.model.getCategories());
    // this.view.fillFilterOptions({
    //   categories: this.model.getCategories(),
    //   priceRange: this.model.getPriceRange(),
    // });
    // init
  }

  onFiltersChanged = (filter) => {
    // console.log("hi");
    // this.view.updateFilterInputs(filter);
    // const filteredProducts = this.model.filterProducts(
    //   this.model.products,
    //   filter
    // );
    // const groupedProducts = this.model.groupProducts(filteredProducts, [
    //   "ITEM CODE",
    //   "DESCRIPTION",
    //   "PRICE",
    // ]);
    // this.view.displayProducts(groupedProducts);
  };
}

// const product = document.querySelector(".product");
// product.addEventListener("click", () => {

// })
