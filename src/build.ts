import { spawn } from 'child_process';
import { build, BuildOptions } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { replaceTscAliasPaths } from 'tsc-alias';

import humanizeDuration from 'humanize-duration';

import log from './lib/log';
import { getCurrentPackageJson } from './lib/node';
import { BuildArgs, TSCOptions } from './types';

const buildWithESBuild = async (input: string, outDir: string, isWatchMode: boolean, esbuildOptions: BuildOptions) => {
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
			outfile: `${outDir}/cjs/index.js`,
			plugins: [nodeExternalsPlugin()],
			target: 'es2016',
			watch: isWatchMode,
			...esbuildOptions
		}),
		build({
			...commonConfig,
			format: 'esm',
			outfile: `${outDir}/esm/index.js`,
			plugins: [nodeExternalsPlugin()],
			watch: isWatchMode
				? {
						onRebuild: (error, result) => {
							if (error) {
								log.error('An error ocurred while building the package. Check logs above 🔝');
							}
							if (result) {
								log.success('⚡ esbuild rebuild done');
							}
						}
				  }
				: false,
			...esbuildOptions
		})
	]);

	log.success(`⚡ esbuild build done in ${humanizeDuration(new Date().getTime() - startTime.getTime())}`);
};

const buildTypeScriptDefinitions = (isWatchMode: boolean, outDir: string, tscOptions: TSCOptions) => {
	const { extendedDiagnostics = false, incremental = false } = tscOptions;

	let command = `tsc --noEmit false --outDir ${outDir}/types --declaration --emitDeclarationOnly --pretty`;

	if (extendedDiagnostics) command += ' --extendedDiagnostics';
	if (incremental) {
		const packageName = getCurrentPackageJson().name;
		command += ` --incremental --tsBuildInfoFile ./node_modules/.cache/${packageName}/tsconfig.tsbuildinfo`;
	}
	if (isWatchMode) command += ' --watch --preserveWatchOutput';

	return new Promise((resolve, reject) => {
		const startTime = new Date();
		const tscChild = spawn('yarn', command.split(' '), { stdio: 'inherit' });

		if (isWatchMode)
			replaceTscAliasPaths({
				declarationDir: `${outDir}/types`,
				outDir: `${outDir}/types`,
				watch: true
			});

		tscChild.on('exit', async code => {
			if (code === 0) {
				if (!isWatchMode) await replaceTscAliasPaths({ declarationDir: `${outDir}/types`, outDir: `${outDir}/types` });
				log.success(`⚡ TS definitions build done in ${humanizeDuration(new Date().getTime() - startTime.getTime())}`);
				resolve(code);
			} else {
				log.error('An error ocurred while building TS definitions. Check logs above 🔝');
				reject(code);
			}
		});
	});
};

const buildPackage = async ({
	entryPoint = 'src/index.ts',
	esbuildOptions = {},
	isWatchMode = false,
	outDir = 'dist',
	tscOptions = {},
	withESBuild = true,
	withTSDefinitions = true
}: BuildArgs = {}) => {
	log.overrideConsoleErrorColor();

	if (isWatchMode) log.info('Running build in watch mode...');

	const promises = [];

	if (withTSDefinitions) promises.push(buildTypeScriptDefinitions(isWatchMode, outDir, tscOptions));
	if (withESBuild) promises.push(buildWithESBuild(entryPoint, outDir, isWatchMode, esbuildOptions));

	const responses = await Promise.allSettled(promises);
	if (responses.some(response => response.status === 'rejected')) process.exit(1);
};

export { buildPackage };
