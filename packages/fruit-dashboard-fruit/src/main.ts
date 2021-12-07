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

	const socket: Socket<ServerToFruitEvents, FruitToServerEvents> = io('wss://vsb-fruit-dashboard.herokuapp.com', { query: { fruitIp: ipv4 } });

	let timer: NodeJS.Timer;

	socket.on('connect', () => {
		timer = setInterval( async() => {
			try {
				const sensorData = await senseHatCli.run();
				socket.send('NEW_SENSOR_DATA', sensorData);
			} catch (err) {
				console.error((err as { stdout: string, stderr: string }).stderr);
			}
		}, 1000);

		socket.on('UPDATE_LEDS', async leds => {
			await senseHatCli.updateLeds(leds);
		})
	});

	socket.on('disconnect', () => {
		clearInterval(timer);
	});
}
main().catch(err => console.error(err));
