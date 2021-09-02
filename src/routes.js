const axios = require("axios");
const urls = require("./urls");
const {
	getCategoryNames,
	getProducts,
	processSingleProduct,
} = require("./utils");

/**
 * returns a list of products and a list of category names
 *
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
