import { Argv } from 'yargs';

import { catchError } from '../lib/error';
import log from '../lib/log';
import { checkNodeInstallation } from '../lib/node';

const name = 'build';
const description = 'Builds your application';

const buildApp = () => {
	log.info('BIEEN');
};

const config = (yargs: Argv) => {
	// prettier-ignore
	return yargs
		.usage('js-bundle build')
		.version(false)
		.help('help')
		.option('help', {  alias: 'h' });
};

const handler = () => {
	catchError(() => {
		checkNodeInstallation();
		buildApp();
	});
};

export default { config, description, handler, name };
