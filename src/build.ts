/* eslint-disable no-console */
import { build, BuildOptions } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { Plugin, rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import humanizeDuration from 'humanize-duration';
import chalk from 'chalk';

import { makeConsoleErrorRed } from './utils';
import { BuildArgs } from './types';

const generateTypescriptDefinitionWithoutWatch = async (
	input: string,
	outDir: string,
	extraRollupPlugins: Plugin[],
	isWatchMode: boolean
) => {
	let bundle;
	let buildFailed = false;

	const startTime = new Date();
	try {
		// Normal bundle without watching
		bundle = await rollup({
			input,
			plugins: [dts(), ...extraRollupPlugins]
		});
		await bundle.write({
			file: `${outDir}/types/index.d.ts`
		});
	} catch (error: any) {
		buildFailed = true;
		console.error('An error ocurred while building TS definitions. Check logs above 🔝');
	}

	if (bundle) await bundle.close();
	if (!buildFailed) {
		console.log(
			chalk.greenBright(
				`⚡ TS definitions build done in ${humanizeDuration(new Date().getTime() - startTime.getTime())}`
			)
		);
	}
	if (!isWatchMode) process.exit(buildFailed ? 1 : 0);
};

const buildWithESBuild = async (
	input: string,
	outDir: string,
	isWatchMode: boolean,
	esbuildOptions: BuildOptions,
	onRebuildCallback: () => void
) => {
	const commonConfig: BuildOptions = {
		bundle: true,
		entryPoints: [input],
		legalComments: 'none',
		minify: true,
		sourcemap: true
	};

	const startTime = new Date();
	await Promise.all([
		build({
			...commonConfig,
			format: 'cjs',
			logLevel: 'silent',
			outfile: `${outDir}/index.cjs.js`,
			plugins: [nodeExternalsPlugin()],
			watch: isWatchMode,
			...esbuildOptions
		}),
		build({
			...commonConfig,
			format: 'esm',
			outfile: `${outDir}/index.esm.js`,
			plugins: [nodeExternalsPlugin()],
			watch: isWatchMode
				? {
						onRebuild: (error, result) => {
							if (error) {
								console.error('An error ocurred while building the package. Check logs above 🔝');
							}
							if (result) {
								console.log(chalk.greenBright('⚡ esbuild rebuild done'));
								onRebuildCallback();
							}
						}
				  }
				: false,
			...esbuildOptions
		})
	]);

	console.log(
		chalk.greenBright(`⚡ esbuild build done in ${humanizeDuration(new Date().getTime() - startTime.getTime())}`)
	);
};

const buildPackage = async ({
	entryPoint = 'src/index.ts',
	esbuildOptions = {},
	isWatchMode = false,
	outDir = 'dist',
	rollupPlugins = [],
	withESBuild = true,
	withTSDefinitions = true
}: BuildArgs = {}) => {
	makeConsoleErrorRed();

	if (isWatchMode) console.log('Running build in watch mode...');

	const generateTSDefinitions = async () => {
		if (withTSDefinitions) {
			await generateTypescriptDefinitionWithoutWatch(entryPoint, outDir, rollupPlugins, isWatchMode);
		}
	};

	if (withESBuild) await buildWithESBuild(entryPoint, outDir, isWatchMode, esbuildOptions, generateTSDefinitions);
	await generateTSDefinitions();
};

export { buildPackage };
