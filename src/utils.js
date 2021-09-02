module.exports.getCategoryNames = (searchResponse) => {
	const availableFilters = searchResponse.filters;
	if (!availableFilters) {
		return [];
	}

	const categoriesFilter = availableFilters.find(
		(filter) => filter.id === "category"
	);

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
			decimals: 0,
		},
		picture: product.pictures ? product.pictures[0].url : product.thumbnail,
		condition,
		free_shiping: product.shipping.free_shipping,
		city: product.address ? product.address.city_name : "",
	};
};
