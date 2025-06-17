import Fuse from "fuse.js";
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // init
    // this.view.fillCategoryList(this.model.getCategories());
    // this.view.fillFilterOptions({
    //   categories: this.model.getCategories(),
    //   priceRange: this.model.getPriceRange(),
    // });
    // init

    // filters
    // this.model.bindFiltersChanged(this.onFiltersChanged);
    // this.model.updateFilters({ COLOUR: "=pink", SIZE: "lrg" });
    // filters

    // cart
    this.model.bindCartChanged(this.onCartChanged);
    // this.model.addCartItem("test", 20.3, "fp2d1d", 2, "1 to 5", "red");
    // this.model.editCartItem({ colour: "red" }, 0);
    // cart
  }

  // filter
  onFiltersChanged = () => {
    const filterKeys = Object.keys(this.model.productFilters);
    const fuse = new Fuse([...this.model.products], {
      keys: filterKeys,
      useExtendedSearch: true,
      findAllMatches: true,
    });
    const filteredProducts = fuse
      .search({
        $and: [this.model.productFilters],
      })
      .map((product) => product["item"]);
    const filteredUniq = this.model.getFilteredInUniq(filteredProducts);
    // this.view.updateFilterInputs(this.model.productFilters);
    // this.view.displayProducts(groupedProducts);
  };
  // filter

  // cart
  onCartChanged = () => {
    this.model.updateCart();
  };
  // cart
}
