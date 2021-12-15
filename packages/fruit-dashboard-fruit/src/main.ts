import {networkInterfaces} from 'os';

import { io, Socket } from 'socket.io-client';

import {FruitToServerEvents, ServerToFruitEvents} from "fruit-dashboard-server";
import {SenseHatCli} from "./sense-hat-cli";

async function main() {
	const interfaces = networkInterfaces();
	const senseHatCli = new SenseHatCli();

	if (!interfaces.eth0) {
		throw new Error('eth0 interface was not found!');
	}

	const ipv4 = interfaces.eth0.find(addr => addr.family === 'IPv4')?.address;

	if (!ipv4) {
		throw new Error('Not connected to the network through eth0!');
	}

	const socket: Socket<ServerToFruitEvents, FruitToServerEvents> = io('https://vsb-fruit-dashboard.herokuapp.com/fruit', { query: { fruitIp: ipv4 } });

	let timer: NodeJS.Timer;

	socket.on('connect', () => {
		console.log(`Connected to a dashboard server`);
		timer = setInterval( async() => {
			try {
				const sensorData = await senseHatCli.run();
				socket.emit('NEW_SENSOR_DATA', { ...sensorData, fruitIp: ipv4, measuredAt: new Date() });
			} catch (err) {
				console.error('Failed to fetch sensor data correctly. Either sensor-hat-cli binary was not found or humidity/pressure sensor failed its initialization.');
			}
		}, 2000);

		socket.on('UPDATE_LEDS', async leds => {
			try {
				console.log(`Updating leds...`);
				await senseHatCli.updateLeds(leds);
				console.log(`Leds updated successfully`);
			} catch (err) {
				console.error(`Failed to update leds display`);
			}
		});
	});

	socket.on('disconnect', () => {
		console.warn('Got disconnected from the server');
		clearInterval(timer);
	});

	socket.on('connect_error', err => {
		console.error(err.message);

		console.log('Retrying connection in 5 seconds...');
		setTimeout(() => {
			socket.connect();
		}, 5000);
	});
}
main().catch(err => { console.error(err); process.exit(1); });
