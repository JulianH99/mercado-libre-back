const axios = require("axios");
const urls = require("./urls");

const getCategoryNames = (searchResponse) => {
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

const getProducts = (searchResponse) => {
	const products = searchResponse.results;

	const processedProducts = products.map(processSingleProduct);

	return processedProducts;
};

const processSingleProduct = (product) => {
	return {
		id: product.id,
		title: product.title,
		price: {
			currency: product.currency_id,
			amount: product.price,
			decimals: 0,
		},
		picture: product.thumbnail,
		condition: product.condition,
		free_shiping: product.shipping.free_shipping,
		city: product.address.city_name,
	};
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getItems = async (req, res) => {
	try {
		const response = await axios.get(urls.search, {
			params: {
				q: req.query.q || "",
			},
		});

		const data = response.data;

		const categoryNames = getCategoryNames(data);
		const products = getProducts(data);

		return res.status(200).json({
			author: {},
			categories: categoryNames,
			items: products,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: e,
		});
	}
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getItem = (req, res) => {};

module.exports = {
	getItems,
	getItem,
};
