const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.use(cors());

app.get("/api/items", routes.getItems);
app.get("/api/item/:id", routes.getItem);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
