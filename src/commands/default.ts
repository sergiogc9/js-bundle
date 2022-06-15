import chalk from 'chalk';
import figlet from 'figlet';

import { catchError } from '../lib/error';
import log from '../lib/log';
import { exec } from '../lib/shell';

const handler = (args: string[]) => {
	catchError(() => {
		if (args.length) {
			const command = args[0];

			throw { message: `The command ${command} does not exist.` };
		} else {
			log.text(figlet.textSync('sergiogc9 js-bundle', {}), chalk.keyword('orange').bold);
			log.text(`\nDocs: ${chalk.blueBright.bold('https://github.com/sergiogc9/js-bundle')}\n`);
			exec('js-bundle --help');
		}
	});
};

export default handler;
