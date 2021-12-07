export interface Vector2D {
	x: number;
	y: number;
	z: number;
}

export interface NewSensorData {
	humidity: number;
	pressure: number;
	temperatureFromHumidity: number;
	temperatureFromPressure: number,
	angularRate: Vector2D,
	linearAcceleration: Vector2D,
	magneticField: Vector2D,
	measuredAt: Date,
	ledsUpdated?: 'OK' | 'FAILED',
	fruitIp: string
}

export interface FruitToServerEvents {
	NEW_SENSOR_DATA: (sensorData: NewSensorData) => void;
}

export interface ServerToFruitEvents {
	UPDATE_LEDS: (leds: number[]) => void;
}

export interface FruitSocketData {
	fruitIp: string;
	order: number;
}

export interface BrowserToServerEvents {
	PRINT_TEXT: (text: string) => void;
}

export interface ServerToBrowserEvents {
	NEW_SENSOR_DATA: (sensorData: NewSensorData) => void;
}
