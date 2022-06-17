const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const chalk = require('chalk');
const humanizeDuration = require('humanize-duration');

const commonConfig = {
	bundle: true,
	entryPoints: ['./src/index.ts', './src/cli.ts'],
	legalComments: 'none',
	minify: true
};

const isWatchMode = process.argv.includes('--watch');

const buildPackage = async () => {
	const startTime = new Date();
	await build({
		...commonConfig,
		format: 'cjs',
		logLevel: 'silent',
		outdir: `dist`,
		platform: 'node',
		plugins: [nodeExternalsPlugin()],
		watch: isWatchMode
	});
	// eslint-disable-next-line no-console
	console.log(
		chalk.greenBright(`⚡ esbuild build done in ${humanizeDuration(new Date().getTime() - startTime.getTime())}`)
	);
};

buildPackage();
