import { Worker, isMainThread, parentPort } from "worker_threads";
import { StoreController } from "./store.controller";

const NUMBER_OF_THREADS = 128;
let db: StoreController;

// This function will be executed by the workers.
// The workers do not have an initialized StoreController object. They have to send their data to the main thread.
const download_and_store = async () => {
	while (true) {
		const random_number = Math.floor(Math.random() * 1000);

		// Accumulate random data.
		let data = [];
		for (let i = 0; i < random_number; i++) {
			data.push({
				first: "first",
				second: 2,
				third: 3,
				fourth: 4,
				fifth: "fifth"
			});
		}

		parentPort.postMessage(data);

		// Wait for a second to simluate a delay.
		// If you reduce this delay, the memory usage will increase more slowly.
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}
};

// Main function that spawns workers. Only called once by main thread.
const main = async (threads = 1) => {
	for (let i = 0; i < threads; i++) {
		// Spawns a new worker that will download and send the data.
		const worker = new Worker(__filename);
		worker.on('message', (data) => {
			db.storeData(data);
		});
	}
};

const memory_usage = async () => {
	// Wait not to overload the system.
	await new Promise((resolve) => setTimeout(resolve, 200));
	const used = process.memoryUsage();
	process.stdout.write(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024)} MB\r`);

	memory_usage();
};

if (isMainThread) {
	db = new StoreController();
	main(NUMBER_OF_THREADS);
	memory_usage();
} else {
	download_and_store();
}
