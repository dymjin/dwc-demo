export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // this.view.formatEmail(this.model.cartItems);

    this.view.displayCategories(this.model.getCategories());

    if (
      !!this.model.productFilters.searchStr ||
      this.model.productFilters?.options?.length > 0
    ) {
      this.view.updateFilterInputs(this.model.productFilters);
      this.onFiltersChanged();
    } else {
      this.view.bindReqProduct(this.handleReqProduct);
    }
    this.view.bindViewMoreProducts(this.handleViewMoreProducts);

    // init
    // this.view.fillFilterOptions({
    //   categories: this.model.getCategories(),
    //   priceRange: this.model.getPriceRange(),
    // });
    // init

    // filters
    this.model.bindFiltersChanged(this.onFiltersChanged);
    this.view.bindChangeFilters(this.handleChangeFilters);
    this.view.bindClearFilters(this.handleClearFilters);
    // filters

    // cart
    this.model.bindCartChanged(this.onCartChanged);
    this.view.bindCreateCartItem(this.handleAddCartItem);
    this.view.displayCart(this.model.cartItems);
    this.view.bindRemoveCartItem(this.handleRemoveCartItem);
    this.view.bindEditCartItems();
    this.view.bindUpdateCartItems(this.handleUpdateCartItems);
    this.view.bindClearCart(this.handleClearCart);
    this.view.bindUpdateCartItemQty(this.handleUpdateCartItemQty);
    this.view.bindFormatEmail(this.handleFormatEmail);

    // this.view.bindUpdateCartItemQty(this.handleUpdateCartItemQty);
    // cart
  }

  // category
  // category

  // products
  handleReqProduct = (id, randomImgNum) => {
    this.view.fillProductModal(this.model.getUniqProduct(id), randomImgNum);
    this.view.updateProductImgModal(randomImgNum);
  };

  handleViewMoreProducts = () => {
    const filteredProducts = this.filterProducts(this.model.productFilters);
    const filteredUniq = this.model.getFilteredInUniq(filteredProducts);
    this.view.displayMoreProducts(filteredUniq);
    this.view.bindReqProduct(this.handleReqProduct);
  };
  // products

  // filter
  handleChangeFilters = (filters) => {
    this.model.updateFilters(filters);
  };

  handleClearFilters = () => {
    this.model.clearFilters();
    // this.model.updateFilters({ searchStr: "", options: [] });
    // this.view.updateFilterInputs({});
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
    if (filter?.options?.length > 0) {
      const categoryOBJ = filter.options.find(
        (item) => Object.keys(item)[0] === "CATEGORY"
      );
      if (categoryOBJ !== undefined) {
        filteredProducts = filteredProducts.filter((product) => {
          return product["CATEGORY"].toLowerCase() === categoryOBJ["CATEGORY"];
        });
      }

      filter.options.forEach((option) => {
        if (Object.keys(option)[0].toLowerCase() !== "category") {
          filteredProducts = [...filteredProducts].filter((product) => {
            return (
              product[Object.keys(option)[0]] !== null &&
              product[Object.keys(option)[0]]
                .toString()
                // .replace(/[\d\. ]/g, "")
                .toLowerCase() === option[Object.keys(option)[0]].toLowerCase()
            );
          });
        }
      });
    }
    return filteredProducts;
  };

  onFiltersChanged = () => {
    this.view.clearDOMProducts();
    this.view.emptyFilterInputs();
    if (Object.keys(this.model.productFilters)?.length > 0) {
      const filteredProducts = this.filterProducts(this.model.productFilters);
      const filteredUniq = this.model.getFilteredInUniq(filteredProducts);
      this.view.updateFilterInputs(this.model.productFilters);
      this.view.displayProducts(filteredUniq);
      this.view.bindReqProduct(this.handleReqProduct);
    }
  };
  // filter

  // cart
  onCartChanged = () => {
    this.model.updateCart();
    this.view.displayCart(this.model.cartItems);
    this.view.bindRemoveCartItem(this.handleRemoveCartItem);
    this.view.bindEditCartItems();
    this.view.bindUpdateCartItemQty(this.handleUpdateCartItemQty);
  };

  handleAddCartItem = (
    id,
    qty,
    description,
    currSize,
    currColour,
    randomImgNum,
    currRandomClr
  ) => {
    const uniqItem = this.model.getUniqProduct(id);
    const product = this.model.getProduct({
      id,
      currSize,
      currColour,
    });
    if (product) {
      this.model.addCartItem(
        id,
        qty,
        product["PRICE"],
        description,
        currSize,
        currColour,
        uniqItem["SIZE"],
        uniqItem["COLOUR"],
        randomImgNum,
        uniqItem["randomColours"],
        currRandomClr
      );
      this.view.addToCartSuccess();
    } else {
      this.view.errorInvalidAddToCart("Could not find colour/size combination");
    }
  };

  handleUpdateCartItems = (changes) => {
    this.model.editCartItems(changes);
  };

  handleRemoveCartItem = (idx) => {
    this.model.removeCartItem(idx);
    if (this.model.cartItems?.length <= 0) {
      this.view.clearCartTotals();
    }
  };

  handleClearCart = () => {
    this.model.clearCart();
    this.view.displayCart();
  };

  handleUpdateCartItemQty = (index, qty, modeOBJ) => {
    this.model.updateCartItemQty(this.model.getCartItem(index), qty, modeOBJ);
    this.model.updateCart();
    // this.view.bindUpdateCartItemQty(this.handleUpdateCartItemQty);
    this.view.updateCartSubtotal(this.model.cartItems);
    this.view.updateCartTotalItems(this.model.cartItems);

    // this.onCartChanged();
  };

  handleFormatEmail = () => {
    this.view.formatEmail(this.model.cartItems);
  };
  // cart
}
