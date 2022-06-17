import { BuildOptions } from 'esbuild';

interface TSCOptions {
	extendedDiagnostics?: boolean;
	incremental?: boolean;
}

interface BuildArgs {
	entryPoint?: string;
	esbuildOptions?: BuildOptions;
	isWatchMode?: boolean;
	outDir?: string;
	tscOptions?: TSCOptions;
	withESBuild?: boolean;
	withTSDefinitions?: boolean;
}

export type { BuildArgs, TSCOptions };
