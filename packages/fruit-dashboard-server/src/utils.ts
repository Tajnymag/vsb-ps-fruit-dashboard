import EventEmitter from "events";

export function waitForEvent<L extends EventEmitter>(listener: L, event: Parameters<typeof listener['on']>[0]): Promise<void> {
	return new Promise(resolve => {
		listener.on(event, () => resolve())
	});
}
