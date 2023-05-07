import { BuildOptions } from 'esbuild';

interface TSCOptions {
	extendedDiagnostics?: boolean;
	incremental?: boolean;
}

interface BuildArgs {
	entryPoint?: string | string[];
	esbuildOptions?: BuildOptions;
	isWatchMode?: boolean;
	onlyES6?: boolean;
	outDir?: string;
	tscOptions?: TSCOptions;
	withESBuild?: boolean;
	withTSDefinitions?: boolean;
}

export type { BuildArgs, TSCOptions };
