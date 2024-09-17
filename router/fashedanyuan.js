const { readCSV } = require("../utils/readcsv");

async function getFASHEDANYUAN(filePath) {
	return await readCSV(filePath);
}

module.exports = {
	getFASHEDANYUAN,
};
