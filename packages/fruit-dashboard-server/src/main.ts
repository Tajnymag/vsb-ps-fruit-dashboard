import {PrismaClient} from '@prisma/client';
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Namespace, Server} from 'socket.io';
import {subHours, subSeconds} from 'date-fns';

import {fonts, renderPixels} from "js-pixel-fonts";

import {
	BrowserToServerEvents,
	FruitSocketData,
	FruitToServerEvents,
	ServerToBrowserEvents,
	ServerToFruitEvents
} from "./types";

const allowedIps = [
	'158.196.22.216',
	'158.196.22.220',
	'158.196.22.213',
	'158.196.22.208',
	'158.196.22.204',
	'158.196.22.222'
];

async function main() {
	const prisma = new PrismaClient();
	const port = parseInt(process.env.PORT as string) || 3000;
	const server = new Server(port,{
		cors: {
			origin: ["https://vsb-fruit-dashboard.netlify.app"],
			methods: ["GET", "POST"],
		}
	});

	const fruits: Namespace<FruitToServerEvents, ServerToFruitEvents, DefaultEventsMap, FruitSocketData> = server.of('fruit');
	const browsers: Namespace<BrowserToServerEvents, ServerToBrowserEvents> = server.of('web');

	fruits.on('connection', socket => {
		const fruitIp = socket.handshake.query.fruitIp;

		if (!fruitIp || typeof fruitIp !== 'string' || !allowedIps.includes(fruitIp)) {
			socket.disconnect();
			return;
		}

		socket.data.fruitIp = fruitIp;
		socket.data.order = allowedIps.indexOf(fruitIp);

		socket.on('NEW_SENSOR_DATA', async sensorData => {
			const angularRateJSON = JSON.stringify(sensorData.angularRate);
			const linearAccelerationJSON = JSON.stringify(sensorData.linearAcceleration);
			const magneticFieldJSON = JSON.stringify(sensorData.magneticField);
			const measurement = {...sensorData, angularRate: angularRateJSON, linearAcceleration: linearAccelerationJSON, magneticField: magneticFieldJSON};

			if (await prisma.measurement.count({where: {measuredAt: {gte: subSeconds(new Date(), 60)}}})) {
				await prisma.measurement.deleteMany({where: {measuredAt: {lte: subHours(new Date(), 2)}}});
				await prisma.measurement.create({data: measurement});
			}

			browsers.emit('NEW_SENSOR_DATA', sensorData);
		});
	});

	browsers.on('connection', socket => {
		socket.on('PRINT_TEXT', text => {
			const bitmapMatrix = renderPixels(text, fonts.sevenPlus);
			const coloredMatrix = bitmapMatrix.map(line => line.map(bit => bit ? [255, 255, 255] : [0, 0, 0]));

			[...fruits.sockets.values()]
				.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
				.forEach((fruit, index) => {
					const coloredPixelArray = coloredMatrix.map(row => row.slice(index * 8, index * 8 + 8)).flat(2);
					fruit.emit('UPDATE_LEDS', coloredPixelArray);
				});
		});
	});
}
main().catch(err => console.error(err));
