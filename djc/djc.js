const fs = require("fs/promises"); // 引入fs模块的promises API

async function example() {
	// 使用fs.open()打开文件，返回一个FileHandle对象
	// 'example.txt'是要打开的文件名，'w'表示写入模式，会创建文件如果不存在
	const fileHandle = await fs.open("example.txt", "a");

	try {
		// 使用FileHandle.writeFile()方法向文件写入数据
		// 这个方法是异步的，会在操作完成后返回一个Promise
		await fileHandle.appendFile("Hello, World!");
		console.log("File written successfully"); // 写入成功后输出信息
	} catch (error) {
		// 如果在文件操作过程中发生错误，catch块将捕获这个错误
		console.error(error);
	} finally {
		// 无论操作成功还是失败，finally块中的代码都会执行
		// 使用FileHandle.close()方法关闭文件，释放系统资源
		await fileHandle.close();
	}
}

// 调用异步函数example，开始文件操作流程
example();

const { workerData, parentPort } = require("worker_threads");
const path = require("path");
const fs = require("fs").promises;

// 从主进程接收的数据源
const dataSource = workerData;

// 步骤 1: 创建主进程
// 主进程负责分配任务，并管理子进程。
const { fork } = require("child_process");

// 创建子进程数组
const workers = [];

// 假设我们有多个数据源
const dataSources = ["data1", "data2", "data3"];

// 为每个数据源创建一个子进程
dataSources.forEach((source, index) => {
	const worker = fork("./dataProcessor.js", [source]);
	workers.push(worker);

	// 监听来自子进程的消息
	worker.on("message", (message) => {
		console.log(`Received from worker ${index}:`, message);
		// 处理子进程返回的数据
	});

	// 监听子进程的错误
	worker.on("error", (err) => {
		console.error(`Worker ${index} error:`, err);
	});
});

// 步骤 2: 创建子进程
// 每个子进程负责从一个数据源读取数据，并使用多线程来处理数据。

// dataProcessor.js:
// 读取数据
fs.readFile(path.join(__dirname, `./${dataSource}.txt`), "utf8")
	.then((data) => {
		// 创建一个工作线程来处理数据
		const { Worker } = require("worker_threads");
		const worker = new Worker(path.join(__dirname, "./dataAnalyzer.js"));

		// 发送数据给工作线程
		worker.postMessage(data);

		// 监听工作线程返回的结果
		worker.on("message", (result) => {
			parentPort.postMessage(result);
		});

		// 监听工作线程的错误
		worker.on("error", (err) => {
			console.error("Worker error:", err);
		});

		// 工作线程结束时关闭
		worker.on("exit", (code) => {
			console.log(`Worker stopped with exit code ${code}`);
		});
	})
	.catch((err) => {
		console.error("Error reading data:", err);
	});

// 步骤 3: 创建工作线程
// 工作线程负责处理数据。

// dataAnalyzer.js:

const { parentPort } = require("worker_threads");

// 处理接收到的数据
function processData(data) {
	// 这里可以添加数据处理逻辑
	return `Processed data: ${data}`;
}

// 监听消息
parentPort.on("message", (data) => {
	const result = processData(data);
	parentPort.postMessage(result);
});
