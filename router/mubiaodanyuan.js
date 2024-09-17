const { readCSV } = require("../utils/readcsv");
async function getMUBIAO(filePath) {
	return await readCSV(filePath);
}
module.exports = {
	getMUBIAO,
};