import { spawn } from 'child_process';
import { build, BuildOptions } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { replaceTscAliasPaths } from 'tsc-alias';

import humanizeDuration from 'humanize-duration';

import log from './lib/log';
import { getCurrentPackageJson } from './lib/node';
import { BuildArgs, TSCOptions } from './types';

const buildWithESBuild = async (
	input: string | string[],
	outDir: string,
	isWatchMode: boolean,
	onlyES6: boolean,
	esbuildOptions: BuildOptions
) => {
	const commonConfig: BuildOptions = {
		bundle: true,
		entryPoints: typeof input === 'string' ? [input] : input,
		legalComments: 'none',
		minify: true,
		sourcemap: true
	};

	const startTime = new Date();
	const buildTasks: Promise<any>[] = [];

	if (!onlyES6) {
		buildTasks.push(
			build({
				...commonConfig,
				format: 'cjs',
				logLevel: 'silent',
				outdir: typeof input === 'string' ? undefined : `${outDir}/cjs`,
				outfile: typeof input === 'string' ? `${outDir}/cjs/index.js` : undefined,
				plugins: [nodeExternalsPlugin()],
				target: 'es2016',
				watch: isWatchMode,
				...esbuildOptions
			})
		);
	}

	buildTasks.push(
		build({
			...commonConfig,
			format: 'esm',
			outdir: typeof input === 'string' ? undefined : `${outDir}/esm`,
			outfile: typeof input === 'string' ? `${outDir}/esm/index.js` : undefined,
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
	);

	await Promise.all(buildTasks);

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
	onlyES6 = false,
	outDir = 'dist',
	tscOptions = {},
	withESBuild = true,
	withTSDefinitions = true
}: BuildArgs = {}) => {
	log.overrideConsoleErrorColor();

	if (isWatchMode) log.info('Running build in watch mode...');

	const promises = [];

	if (withTSDefinitions) promises.push(buildTypeScriptDefinitions(isWatchMode, outDir, tscOptions));
	if (withESBuild) promises.push(buildWithESBuild(entryPoint, outDir, isWatchMode, onlyES6, esbuildOptions));

	const responses = await Promise.allSettled(promises);
	const failedResponse = responses.find(response => response.status === 'rejected');
	if (failedResponse) {
		log.error(`An error ocurred with reason:`);
		log.error((failedResponse as any).reason);
		process.exit(1);
	}
};

export { buildPackage };
