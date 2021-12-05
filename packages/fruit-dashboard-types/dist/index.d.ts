import { z } from 'zod';
export declare const Vector2D: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    z: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    z: number;
}, {
    x: number;
    y: number;
    z: number;
}>;
export declare type Vector2D = z.infer<typeof Vector2D>;
export declare const SlaveRawOutput: z.ZodObject<{
    humidity: z.ZodString;
    pressure: z.ZodString;
    temperature_from_humidity: z.ZodString;
    temperature_from_pressure: z.ZodString;
    angular_rate: z.ZodString;
    linear_acceleration: z.ZodString;
    magnetic_field: z.ZodString;
    leds_updated: z.ZodString;
}, "strip", z.ZodTypeAny, {
    humidity: string;
    pressure: string;
    temperature_from_humidity: string;
    temperature_from_pressure: string;
    angular_rate: string;
    linear_acceleration: string;
    magnetic_field: string;
    leds_updated: string;
}, {
    humidity: string;
    pressure: string;
    temperature_from_humidity: string;
    temperature_from_pressure: string;
    angular_rate: string;
    linear_acceleration: string;
    magnetic_field: string;
    leds_updated: string;
}>;
export declare type SlaveRawOutput = z.infer<typeof SlaveRawOutput>;
export declare const SlaveOutput: z.ZodObject<z.extendShape<{
    humidity: z.ZodString;
    pressure: z.ZodString;
    temperature_from_humidity: z.ZodString;
    temperature_from_pressure: z.ZodString;
    angular_rate: z.ZodString;
    linear_acceleration: z.ZodString;
    magnetic_field: z.ZodString;
    leds_updated: z.ZodString;
}, {
    humidity: z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit: string;
    }, {
        value: number;
        unit: string;
    }>;
    pressure: z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit: string;
    }, {
        value: number;
        unit: string;
    }>;
    temperature_from_humidity: z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit: string;
    }, {
        value: number;
        unit: string;
    }>;
    temperature_from_pressure: z.ZodObject<{
        value: z.ZodNumber;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit: string;
    }, {
        value: number;
        unit: string;
    }>;
    angular_rate: z.ZodObject<{
        value: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    }, {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    }>;
    linear_acceleration: z.ZodObject<{
        value: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    }, {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    }>;
    magnetic_field: z.ZodObject<{
        value: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>;
        unit: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    }, {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    }>;
    leds_updated: z.ZodEnum<["OK", "FAILED"]>;
    timestamp: z.ZodNumber;
    slave_ip: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    humidity: {
        value: number;
        unit: string;
    };
    pressure: {
        value: number;
        unit: string;
    };
    temperature_from_humidity: {
        value: number;
        unit: string;
    };
    temperature_from_pressure: {
        value: number;
        unit: string;
    };
    angular_rate: {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    };
    linear_acceleration: {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    };
    magnetic_field: {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    };
    leds_updated: "OK" | "FAILED";
    timestamp: number;
    slave_ip: string;
}, {
    humidity: {
        value: number;
        unit: string;
    };
    pressure: {
        value: number;
        unit: string;
    };
    temperature_from_humidity: {
        value: number;
        unit: string;
    };
    temperature_from_pressure: {
        value: number;
        unit: string;
    };
    angular_rate: {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    };
    linear_acceleration: {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    };
    magnetic_field: {
        value: {
            x: number;
            y: number;
            z: number;
        };
        unit: string;
    };
    leds_updated: "OK" | "FAILED";
    timestamp: number;
    slave_ip: string;
}>;
export declare type SlaveOutput = z.infer<typeof SlaveOutput>;
