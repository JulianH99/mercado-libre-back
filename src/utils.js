module.exports.getCategoryNames = (searchResponse) => {
	// get filters from response object to extract the category
	// filter
	const availableFilters = searchResponse.filters;
	if (!availableFilters) {
		return [];
	}

	const categoriesFilter = availableFilters.find(
		(filter) => filter.id === "category"
	);

	// get only the path from root, which contains the actual categories
	// to paint the breadcrumb
	const pathFromRoot = categoriesFilter.values[0].path_from_root;

	const categoryNames = pathFromRoot.map((path) => path.name);

	return categoryNames;
};

module.exports.getProducts = (searchResponse) => {
	const products = searchResponse.results;

	const processedProducts = products.map(processSingleProduct);

	return processedProducts;
};

module.exports.processSingleProduct = (product) => {
	// find condition attribute inside the product object
	const attributeCondition = product.attributes.find(
		(attr) => attr.id === "ITEM_CONDITION"
	);

	const condition = attributeCondition
		? attributeCondition.values[0].name
		: product.condition;

	return {
		id: product.id,
		title: product.title,
		price: {
			currency: product.currency_id,
			amount: product.price,
		},
		// get the bigger picture if available, otherwise get the small thumbnail
		picture: product.pictures ? product.pictures[0].url : product.thumbnail,
		condition,
		free_shiping: product.shipping.free_shipping,
		city: product.address ? product.address.city_name : "",
	};
};
