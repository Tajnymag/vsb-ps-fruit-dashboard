import EventEmitter from "events";
import {promisify} from "util";
import {execFile} from "child_process";

export const execAsync = promisify(execFile);

export function waitForEvent<L extends EventEmitter>(listener: L, event: Parameters<typeof listener['on']>[0]): Promise<void> {
	return new Promise(resolve => {
		listener.on(event, () => resolve())
	});
}
