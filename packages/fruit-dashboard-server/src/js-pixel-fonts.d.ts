declare module 'js-pixel-fonts' {
	import { PNG } from 'pngjs';

	export namespace fonts {
		const sevenPlus: any;
		const slumbers: any;
	}
	export function renderPixels(text: string, font: fonts): (0|1)[][];
	export function renderImage(text: string, font: fonts, { foreground, background, scale }: {
		foreground: [number, number, number, number?];
		background: [number, number, number, number?];
		scale?: number;
	}): PNG;
}
