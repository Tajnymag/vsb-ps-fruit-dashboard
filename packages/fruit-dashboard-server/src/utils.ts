import EventEmitter from "events";

export function waitForEvent<L extends EventEmitter>(listener: L, event: Parameters<typeof listener['on']>[0]): Promise<void> {
	return new Promise(resolve => {
		listener.on(event, () => resolve())
	});
}

export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export function createMatrix2D<T extends unknown>(rows: number, cols: number, defaultValue: T): T[][] {
	const matrix: T[][] = [];

	for (let rowIndex = 0; rowIndex < rows; ++rowIndex) {
		const row: T[] = [];
		for (let colIndex = 0; colIndex < cols; ++colIndex) {
			row.push(defaultValue);
		}
		matrix.push(row);
	}

	return matrix;
}

export function sliceMatrix<T extends unknown>(matrix: T[][], colFrom: number, colTo?: number): T[][] {
	colTo = colTo ? colTo + 1 : matrix[0].length;
	const splicedMatrix = createMatrix2D(matrix.length, colTo - colFrom, matrix[0][0]);

	for (let rowIndex = 0; rowIndex < splicedMatrix.length; ++rowIndex) {
		for (let colIndex = colFrom; colIndex < splicedMatrix[0].length; ++colIndex) {
			splicedMatrix[rowIndex][colIndex] = matrix[rowIndex][colIndex + colFrom];
		}
	}

	return splicedMatrix;
}
