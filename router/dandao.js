const { readCSV } = require("../utils/readcsv");
async function getDANDAO(fileList,data) {
	let resultList = [];
	for (let [index,filePath] of fileList.entries()) {
		let result = await readCSV(filePath);
		console.log(filePath);

		resultList.push({ "SE":data[index], result });
	}
	return resultList;
}
module.exports = {
	getDANDAO,
};