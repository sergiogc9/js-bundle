import { Argv } from 'yargs';

import { buildPackage } from '../build';
import { catchError } from '../lib/error';
import log from '../lib/log';
import { checkNodeInstallation } from '../lib/node';

interface CommandArgs {
	onlyBundle?: boolean;
	onlyTypes?: boolean;
	outDir?: string;
	watch?: boolean;
}

const name = 'build';
const description = 'Builds your application';

const config = (yargs: Argv) => {
	// prettier-ignore
	return yargs
		.usage('js-bundle build')
		.version(false)
		.help('help')
		.option('help', {  alias: 'h' })

	.option('only-bundle', {
		default: false,
		describe: 'Only perform bundling using esbuild. No TS definition will be performed.',
		type: 'boolean'
	})
	.option('only-types', {
		default: false,
		describe: 'Only generate TypeScript types. No bundling will be performed',
		type: 'boolean'
	})
	.option('out-dir', {
		alias: 'o',
		default: 'dist',
		describe: 'Output directory',
		type: 'string'
	})
	.option('watch', {
		alias: 'w',
		default: false,
		describe: 'Use watch mode',
		type: 'boolean'
	});
};

const handler = (args: CommandArgs) => {
	catchError(() => {
		checkNodeInstallation();

		const { onlyBundle, onlyTypes, outDir, watch } = args;

		log.info('Building app from cli...');
		buildPackage({
			isWatchMode: watch,
			outDir,
			withESBuild: !onlyTypes,
			withTSDefinitions: !onlyBundle
		});
	});
};

export default { config, description, handler, name };
