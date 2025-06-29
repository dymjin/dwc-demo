import Fuse from "fuse.js";
export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.formatEmail(this.model.cartItems);

    this.view.displayCategories(this.model.getCategories());
    if (Object.keys(this.model.productFilters).length > 0) {
      this.view.updateFilterInputs(this.model.productFilters);
    }

    // this.view.bindChangeCategory(this.handleChangeCategory);
    // this.view.bindChangeCategory();
    // this.view.updateCategoryBG("balls");
    // this.view.displayProducts([
    //   this.model.uniqProducts[0],
    //   this.model.uniqProducts[1],
    //   this.model.uniqProducts[1],
    //   this.model.uniqProducts[1],
    //   this.model.uniqProducts[1],
    // ]);
    // this.view.displayProduct(this.model.uniqProducts[1]);

    this.view.bindReqProduct(this.handleReqProduct);
    // init
    // this.view.fillCategoryList(this.model.getCategories());
    // this.view.fillFilterOptions({
    //   categories: this.model.getCategories(),
    //   priceRange: this.model.getPriceRange(),
    // });
    // init

    // filters
    this.model.bindFiltersChanged(this.onFiltersChanged);
    // this.model.updateFilters({
    //   searchStr: "strappy",
    //   options: [{ COLOUR: "navy" }, { COLOUR: "pink" }],

    //   // SIZE: ["med", "lrg", "10 to 10.5", "Adult"],
    // });
    // this.view.fillFilterOptions()
    this.view.bindChangeFilters(this.handleChangeFilters);

    // filters

    // cart
    this.model.bindCartChanged(this.onCartChanged);
    // this.model.addCartItem("test", 20.3, "fp2d1d", 2, "1 to 5", "blue");
    // this.model.editCartItem({ colour: "red" }, 0);
    // cart
  }

  // category
  handleChangeCategory = (category) => {};
  // category

  // products
  handleReqProduct = (id) => {
    this.view.fillProductModal(this.model.getUniqProduct(id));
  };
  // products

  // filter
  handleChangeFilters = (filters) => {
    this.model.updateFilters(filters);
  };

  filterProducts = (filter) => {
    let products = [...this.model.products];
    let filteredProducts = products;
    if (filter?.searchStr !== "") {
      filteredProducts = filteredProducts.filter((product) => {
        return product.DESCRIPTION.toLowerCase()
          .replaceAll(" ", "")
          .includes(filter.searchStr.toLowerCase().replaceAll(" ", ""));
      });
    }
    // console.log(filteredProducts)
    if (filter?.options?.length > 0) {
      const categoryOBJ = filter.options.find(
        (item) => Object.keys(item)[0] === "CATEGORY"
      );
      if (categoryOBJ !== undefined) {
        filteredProducts = filteredProducts.filter((product) => {
          return product["CATEGORY"].toLowerCase() === categoryOBJ["CATEGORY"];
        });
      }
      // console.log(filteredProducts)

      filter.options.forEach((option) => {
        if (Object.keys(option)[0].toLowerCase() !== "category") {
          filteredProducts = [...filteredProducts].filter((product) => {
            // console.log(
            //   product[Object.keys(option)[0]].toString().replace(/[\d\. ]/g, "")
            // );
            // console.log(product[Object.keys(option)[0]].replace(/[\d\. ]/g, ""))
            return (
              product[Object.keys(option)[0]] !== null &&
              product[Object.keys(option)[0]]
                .toString()
                .replace(/[\d\. ]/g, "")
                .toLowerCase() === option[Object.keys(option)[0]].toLowerCase()
            );
          });
        }
      });
    }
    return filteredProducts;
  };

  onFiltersChanged = () => {
    const filteredProducts = this.filterProducts(this.model.productFilters);
    const filteredUniq = this.model.getFilteredInUniq(filteredProducts);
    console.log(filteredProducts);
    console.log(filteredUniq);
    // const fuse = new Fuse([...this.model.products], {
    //   keys: filterKeys,
    //   useExtendedSearch: true,
    //   findAllMatches: true,
    // });
    // const filteredProducts = fuse
    //   .search({
    //     $and: [this.model.productFilters],
    //   })
    //   .map((product) => product["item"]);
    // console.log(filteredUniq);
    this.view.updateFilterInputs(this.model.productFilters);
    // this.view.displayProducts(filteredUniq);
    // this.view.bindReqProduct(this.handleReqProduct);
  };
  // filter

  // cart
  onCartChanged = () => {
    this.model.updateCart();
  };
  // cart
}
