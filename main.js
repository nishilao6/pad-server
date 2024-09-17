const express = require("express");
const fs = require("fs");
const app = express();
const net = require("net")
const { getFASHEDANYUAN } = require("./router/fashedanyuan");
const { getMUBIAO } = require("./router/mubiaodanyuan");
const { getDANDAO } = require("./router/dandao");
const hi='hi'

// 发射单元文件
let fashedanyuanFilePath = "./mock/fashedanyuan.csv";
// 目标单元文件
let mubiaoFilePath = "./mock/mubiao.csv";
//  弹道文件目录
let dandaoFilePath = "./mock/dandao";

// 读取配置文件目录 fileList
let fileList = fs.readdirSync("./mock", (err) => {
	if (err) console.log(err);
});

// 读取发射单元文件
let fileCont = fs.readFileSync(fashedanyuanFilePath, "utf-8");

// 获取发射单元
app.get("/fashedanyuan", async function (req, res) {
	let result = await getFASHEDANYUAN(fashedanyuanFilePath);
	res.send(result);
});

// 获取目标单元
app.get("/mubiao", async function (req, res) {
	let result = await getMUBIAO(mubiaoFilePath);
	res.send(result);
});

// 获取弹道
app.get("/", async function (req, res) {
	// let data = req.body()
	// [发射单元代号，目标编号]
	data = [
		[1, 1],
		[2, 1],
		[3, 1],
		[1, 2],
		[2, 2],
		[3, 2],
	];
	let fileList = [];
	for (let i = 0; i < data.length; i++) {
		let fileName =
			dandaoFilePath +
			"/" +
			"start" +
			data[i][0] +
			"end" +
			data[i][1] +
			".csv";
		fileList.push(fileName);
	}
	console.log(fileList);
	let result = await getDANDAO(fileList,data);
	res.send(result);
});

app.listen(3000);


