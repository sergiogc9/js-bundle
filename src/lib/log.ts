/* eslint-disable no-console */
import chalk from 'chalk';

class Log {
	public text = (text: string, chalkModifier: chalk.Chalk = chalk) => {
		console.log(chalkModifier(text));
	};

	public info = (text: string, chalkModifier: chalk.Chalk = chalk) => {
		console.log(chalkModifier.blueBright(text));
	};

	public warn = (text: string, chalkModifier: chalk.Chalk = chalk) => {
		console.log(chalkModifier.yellowBright(text));
	};

	public error = (text: string, chalkModifier: chalk.Chalk = chalk) => {
		console.error(chalkModifier.redBright(text));
	};

	public success = (text: string, chalkModifier: chalk.Chalk = chalk) => {
		console.error(chalkModifier.greenBright(text));
	};

	public overrideConsoleErrorColor = () => {
		const originalConsoleError = console.error;
		console.error = (...args: any[]) => originalConsoleError(chalk.redBright(...args));
	};
}

export default new Log();
