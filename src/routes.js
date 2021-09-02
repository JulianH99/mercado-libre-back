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
			error: true,
		});
	}
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getItem = async (req, res) => {
	try {
		const id = req.params.id;

		const productRes = await axios.get(`${urls.items}/${id}`);
		const descriptionRes = await axios.get(`${urls.items}/${id}/description`);

		const productData = productRes.data;
		const descriptionData = descriptionRes.data;

		const finalProd = {
			...processSingleProduct(productData),
			sold_quantity: productData.sold_quantity,
			description: descriptionData.plain_text,
		};

		return res.status(200).json({
			item: finalProd,
		});
	} catch (e) {
		return res.status(500).json({
			error: true,
		});
	}
};

module.exports = {
	getItems,
	getItem,
};
