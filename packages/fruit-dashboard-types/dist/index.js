"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlaveOutput = exports.SlaveRawOutput = exports.Vector2D = void 0;
const zod_1 = require("zod");
exports.Vector2D = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    z: zod_1.z.number()
});
exports.SlaveRawOutput = zod_1.z.object({
    humidity: zod_1.z.string(),
    pressure: zod_1.z.string(),
    temperature_from_humidity: zod_1.z.string(),
    temperature_from_pressure: zod_1.z.string(),
    angular_rate: zod_1.z.string(),
    linear_acceleration: zod_1.z.string(),
    magnetic_field: zod_1.z.string(),
    leds_updated: zod_1.z.string(),
});
exports.SlaveOutput = exports.SlaveRawOutput.extend({
    humidity: zod_1.z.object({
        value: zod_1.z.number(),
        unit: zod_1.z.string()
    }),
    pressure: zod_1.z.object({
        value: zod_1.z.number(),
        unit: zod_1.z.string()
    }),
    temperature_from_humidity: zod_1.z.object({
        value: zod_1.z.number(),
        unit: zod_1.z.string()
    }),
    temperature_from_pressure: zod_1.z.object({
        value: zod_1.z.number(),
        unit: zod_1.z.string()
    }),
    angular_rate: zod_1.z.object({
        value: exports.Vector2D,
        unit: zod_1.z.string()
    }),
    linear_acceleration: zod_1.z.object({
        value: exports.Vector2D,
        unit: zod_1.z.string()
    }),
    magnetic_field: zod_1.z.object({
        value: exports.Vector2D,
        unit: zod_1.z.string()
    }),
    leds_updated: zod_1.z.enum(['OK', 'FAILED']),
    timestamp: zod_1.z.number(),
    slave_ip: zod_1.z.string()
});
