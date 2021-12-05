import { z } from 'zod';

export const Vector2D = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
});
export type Vector2D = z.infer<typeof Vector2D>;

export const SlaveRawOutput = z.object({
	humidity: z.string(),
	pressure: z.string(),
	temperature_from_humidity: z.string(),
	temperature_from_pressure: z.string(),
	angular_rate: z.string(),
	linear_acceleration: z.string(),
	magnetic_field: z.string(),
	leds_updated: z.string(),
});
export type SlaveRawOutput = z.infer<typeof SlaveRawOutput>;

export const SlaveOutput = SlaveRawOutput.extend({
	humidity: z.object({
		value: z.number(),
		unit: z.string()
	}),
	pressure: z.object({
		value: z.number(),
		unit: z.string()
	}),
	temperature_from_humidity: z.object({
		value: z.number(),
		unit: z.string()
	}),
	temperature_from_pressure: z.object({
		value: z.number(),
		unit: z.string()
	}),
	angular_rate: z.object({
		value: Vector2D,
		unit: z.string()
	}),
	linear_acceleration: z.object({
		value: Vector2D,
		unit: z.string()
	}),
	magnetic_field: z.object({
		value: Vector2D,
		unit: z.string()
	}),
	leds_updated: z.enum(['OK', 'FAILED']),
	timestamp: z.number(),
	slave_ip: z.string()
});
export type SlaveOutput = z.infer<typeof SlaveOutput>;
