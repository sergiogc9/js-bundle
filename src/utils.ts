import chalk from 'chalk';

const makeConsoleErrorRed = () => {
	// eslint-disable-next-line no-console
	const originalConsoleError = console.error;
	// eslint-disable-next-line no-console
	console.error = (...args: any[]) => originalConsoleError(chalk.redBright(...args));
};

export { makeConsoleErrorRed };
