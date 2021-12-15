import {createServer} from "http";
import {PrismaClient} from '@prisma/client';
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Namespace, Server, Socket} from 'socket.io';
import {subHours, subSeconds} from 'date-fns'

import {fonts, renderPixels} from "js-pixel-fonts";

import {
	BrowserToServerEvents,
	FruitSocketData,
	FruitToServerEvents, NewSensorData,
	ServerToBrowserEvents,
	ServerToFruitEvents, Vector2D
} from "./types";
import {sleep} from "./utils";
import {type} from "os";

const allowedIps = [
	'158.196.22.216',
	'158.196.22.220',
	'158.196.22.213',
	'158.196.22.208',
	'158.196.22.204',
	'158.196.22.222'
];

function printBitmapMatrix(bitmapMatrix: (0|1)[][], sockets: IterableIterator<Socket>) {
	const coloredMatrix = bitmapMatrix.map(line => line.map(bit => bit ? [255, 255, 255] : [0, 0, 0]));

	[...sockets]
		.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
		.forEach((fruit, index) => {
			const from = index * 8;
			const to = from + 8;

			if (from >= coloredMatrix[0].length) return;

			const coloredPixelArray = coloredMatrix.slice(0, 8).map(row => row.slice(from, to)).flat(2);

			if (coloredPixelArray.length !== (8 * 8 * 3)) {
				console.error(`The programmer doesn't know what he's doing so the pixel array for fruit ${fruit.data.fruitIp} isn't 64*3 items long -_-`);
				return;
			}

			console.log(`Fruit ${fruit.data.fruitIp} priting:\n${coloredPixelArray}`);
			fruit.emit('UPDATE_LEDS', coloredPixelArray);
		});
}

async function main() {
	const prisma = new PrismaClient();
	const port = parseInt(process.env.PORT as string) || 3000;
	const httpServer = createServer();
	const socketServer = new Server(httpServer, {
		cors: {
			origin: ["https://vsb-fruit-dashboard.netlify.app"],
			methods: ["GET", "POST"],
		}
	});

	const fruits: Namespace<FruitToServerEvents, ServerToFruitEvents, DefaultEventsMap, FruitSocketData> = socketServer.of('fruit');
	const browsers: Namespace<BrowserToServerEvents, ServerToBrowserEvents> = socketServer.of('web');

	let currentlyPrinting = false;

	fruits.on('connection', socket => {
		const fruitIp = socket.handshake.query.fruitIp;

		if (!fruitIp || typeof fruitIp !== 'string' || !allowedIps.includes(fruitIp)) {
			console.warn(`Fruit ${socket.handshake.address} is being disconnected due to not providing a valid fruit IP!`);
			socket.disconnect(true);
			return;
		} else {
			console.log(`Fruit ${fruitIp} got connected successfully`);
			socket.data.fruitIp = fruitIp;
			socket.data.order = allowedIps.indexOf(fruitIp);
		}

		socket.on('NEW_SENSOR_DATA', async sensorData => {
			console.log(`Got a fresh new set of data from fruit ${socket.data.fruitIp}`);

			const angularRateJSON = JSON.stringify(sensorData.angularRate);
			const linearAccelerationJSON = JSON.stringify(sensorData.linearAcceleration);
			const magneticFieldJSON = JSON.stringify(sensorData.magneticField);
			const measurement = {...sensorData, angularRate: angularRateJSON, linearAcceleration: linearAccelerationJSON, magneticField: magneticFieldJSON, ledsUpdated: undefined};

			try {
				if (await prisma.measurement.count({where: {fruitIp: socket.data.fruitIp, measuredAt: {gte: subSeconds(new Date(), 60)}}}) === 0) {
					console.log(`Storing measurements for fruit ${socket.data.fruitIp}`);
					await prisma.measurement.deleteMany({where: {measuredAt: {lte: subHours(new Date(), 2)}}});
					await prisma.measurement.create({data: measurement});
				}
			} catch (err) {
				console.error('Could not store measurements in the database!');
				console.error(err);
			}

			browsers.emit('NEW_SENSOR_DATA', sensorData);
		});
	});

	browsers.on('connection', socket => {
		console.log(`A new browser client connected: ${socket.handshake.address}`);

		socket.on('PRINT_TEXT', async text => {
			console.log(`Got a request to print text ${JSON.stringify(text)} on the fruit boards`);

			if (currentlyPrinting) {
				console.warn(`Skipping current print request as there's another print jobs running!`);
				return;
			}

			const bitmapMatrix = renderPixels(text, fonts.sevenPlus);
			const fruitsCount = fruits.sockets.size;

			// flip Y by 180 degrees due to inverted displays
			bitmapMatrix.reverse();

			// pad columns from left and right
			bitmapMatrix.forEach(row => {
				for (let i = 0; i < fruitsCount * 8; ++i) {
					row.unshift(0);
					row.push(0);
				}
			});

			const rowLength = bitmapMatrix[0].length;

			// pad rows
			while (bitmapMatrix.length % 8 !== 0) {
				const row: 0[] = [];
				for (let i = 0; i < rowLength; ++i) row.push(0);
				bitmapMatrix.push(row);
			}

			currentlyPrinting = true;
			for (let i = 0; i < rowLength; ++i) {
				bitmapMatrix.forEach(row => {
					row.unshift(0);
				});
				printBitmapMatrix(bitmapMatrix, fruits.sockets.values());
				await sleep(500);
			}
			currentlyPrinting = false;
		});

		socket.on('GET_SENSOR_DATA', async (cb) => {
			try {
				const measurements = await prisma.measurement.findMany();

				return cb(measurements.map(m => ({
					humidity: m.humidity.toNumber(),
					fruitIp: m.fruitIp,
					measuredAt: m.measuredAt,
					temperatureFromPressure: m.temperatureFromPressure.toNumber(),
					temperatureFromHumidity: m.temperatureFromHumidity.toNumber(),
					pressure: m.pressure.toNumber(),
					angularRate: <unknown>m.angularRate as Vector2D,
					linearAcceleration: <unknown>m.linearAcceleration as Vector2D,
					magneticField: <unknown>m.magneticField as Vector2D
				})));
			} catch (err) {
				console.error(`Failed to fetch archived sensor data`);
				console.error(err);
			}
		});
	});

	httpServer.listen(port, () => {
		console.log(`Started listening on port ${port}...`);
	});
}
main().catch(err => console.error(err));
