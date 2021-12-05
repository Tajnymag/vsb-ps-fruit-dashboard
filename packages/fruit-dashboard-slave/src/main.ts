import {execFile} from 'child_process';
import {promisify} from 'util';
import {networkInterfaces} from 'os';

import WebSocket from "ws";

import {SlaveOutput, SlaveRawOutput} from "fruit-dashboard-types";

const execAsync = promisify(execFile);

const ws = new WebSocket('ws://vsb-fruit-dashboard.herokuapp.com');

function parseVector2D(value: string) {
	const [rawX, rawY, rawZ] = value.split(',');

	const x = parseFloat(rawX);
	const y = parseFloat(rawY);
	const z = parseFloat(rawZ);

	return {x, y, z};
}

const interfaces = networkInterfaces();
const ipv4 = (interfaces.eth0) ? interfaces.eth0.find(addr => addr.family === 'IPv4')?.address ?? 'unknown' : 'unknown';

ws.on('open', async () => {
	setInterval(async () => {
		try {
			const slaveProcess = await execAsync('sense-hat-cli');
			const splitOutput = slaveProcess.stdout.split('\n').map(line => line.split('\t')).reduce((acc, row) => {
				acc[row[0]] = row[1];
				return acc
			}, {} as Record<any, any>);

			const rawSlaveOutput = SlaveRawOutput.parse(splitOutput);

			const humidity = rawSlaveOutput.humidity.split(' ');
			const pressure = rawSlaveOutput.pressure.split(' ');
			const temperature_from_humidity = rawSlaveOutput.temperature_from_humidity.split(' ');
			const temperature_from_pressure = rawSlaveOutput.temperature_from_pressure.split(' ');
			const angular_rate = rawSlaveOutput.angular_rate.split(' ');
			const linear_acceleration = rawSlaveOutput.linear_acceleration.split(' ');
			const magnetic_field = rawSlaveOutput.magnetic_field.split(' ');
			const leds_updated = rawSlaveOutput.leds_updated;

			const sensors: SlaveOutput = {
				humidity: {
					value: parseFloat(humidity[0]),
					unit: humidity[1]
				},
				pressure: {
					value: parseFloat(pressure[0]),
					unit: pressure[1]
				},
				temperature_from_humidity: {
					value: parseFloat(temperature_from_humidity[0]),
					unit: temperature_from_humidity[1]
				},
				temperature_from_pressure: {
					value: parseFloat(temperature_from_pressure[0]),
					unit: temperature_from_pressure[1]
				},
				angular_rate: {
					value: parseVector2D(angular_rate[0]),
					unit: angular_rate[1]
				},
				linear_acceleration: {
					value: parseVector2D(linear_acceleration[0]),
					unit: linear_acceleration[0]
				},
				magnetic_field: {
					value: parseVector2D(magnetic_field[0]),
					unit: magnetic_field[1]
				},
				leds_updated: leds_updated[1] === 'OK' ? 'OK' : 'FAILED',
				timestamp: Date.now() / 1000,
				slave_ip: ipv4
			}

			ws.send({ event: 'NEW_SENSOR_DATA', sensors });
		} catch (err) {
			console.error((err as { stdout: string, stderr: string }).stderr);
		}
	}, 1000);
})


