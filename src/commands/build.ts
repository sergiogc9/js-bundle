import { Platform } from 'esbuild';
import { Argv } from 'yargs';

import { buildPackage } from '../build';
import { catchError } from '../lib/error';
import log from '../lib/log';
import { checkNodeInstallation } from '../lib/node';

interface CommandArgs {
	onlyBundle?: boolean;
	onlyEs6?: boolean;
	onlyTypes?: boolean;
	outDir?: string;
	platform?: string;
	tscIncremental?: boolean;
	tscExtendDiagnostics?: boolean;
	watch?: boolean;
}

const name = 'build';
const description = 'Builds your application';

const config = (yargs: Argv) => {
	return yargs
		.usage('js-bundle build')
		.version(false)
		.help('help')
		.option('help', { alias: 'h' })

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
		.option('only-es6', {
			default: false,
			describe: 'Only perform bundling with ES6 (mjs) target. No cjs bundling will be performed.',
			type: 'boolean'
		})
		.option('out-dir', {
			alias: 'o',
			default: 'dist',
			describe: 'Output directory',
			type: 'string'
		})
		.option('platform', {
			choices: ['browser', 'neutral', 'node'],
			default: 'browser',
			describe: 'Esbuild platform option',
			type: 'string'
		})
		.option('tsc-incremental', {
			default: false,
			describe: 'Use incremental flag with tsc',
			type: 'boolean'
		})
		.option('tsc-extend-diagnostics', {
			default: false,
			describe: 'Use extend diagnostics flag with tsc',
			type: 'boolean'
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

		const { onlyBundle, onlyTypes, onlyEs6, outDir, platform, tscIncremental, tscExtendDiagnostics, watch } = args;

		log.info('Building app from cli...');
		buildPackage({
			isWatchMode: watch,
			onlyES6: onlyEs6,
			outDir,
			tscOptions: {
				extendedDiagnostics: tscExtendDiagnostics,
				incremental: tscIncremental
			},
			withESBuild: !onlyTypes,
			withTSDefinitions: !onlyBundle,
			esbuildOptions: {
				platform: platform as Platform
			}
		});
	});
};

export default { config, description, handler, name };
