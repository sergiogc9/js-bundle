const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const chalk = require('chalk');
const humanizeDuration = require('humanize-duration');

const commonConfig = {
	bundle: true,
	legalComments: 'none',
	minify: true,
	sourcemap: true
};

const isWatchMode = process.argv.includes('--watch');

const buildPackage = async () => {
	const startTime = new Date();

	await Promise.all([
		build({
			...commonConfig,
			entryPoints: ['./src/index.ts', './src/cli.ts'],
			format: 'cjs',
			logLevel: 'silent',
			outdir: `dist/cjs/`,
			platform: 'node',
			plugins: [nodeExternalsPlugin()],
			watch: isWatchMode
		}),
		build({
			...commonConfig,
			entryPoints: ['./src/index.ts'],
			format: 'esm',
			logLevel: 'silent',
			outdir: `dist/esm`,
			platform: 'node',
			plugins: [nodeExternalsPlugin()],
			watch: isWatchMode
		})
	]);
	// eslint-disable-next-line no-console
	console.log(
		chalk.greenBright(`⚡ esbuild build done in ${humanizeDuration(new Date().getTime() - startTime.getTime())}`)
	);
};

buildPackage();
