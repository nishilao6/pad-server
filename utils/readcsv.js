const fs = require("fs");
const csv = require("csv");

// 读取CSV数据文件,并返回
async function readCSV(filePath) {
	let parser2 = csv.parse({
		columns: true, // 使用第一行作为头部，并创建一个对象数组
		skip_empty_lines: true, //跳过空行
	});
	// 按流读取
	let OBJ = [];
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(parser2)
			.on("data", (row) => {
				OBJ.push(row);
			})
			.on("end", () => {
				console.log("csv file success parsed");
				resolve(OBJ);
			})
			.on("error", (error) => {
				reject(error);
			});
	});
}

module.exports = {
	readCSV,
};
