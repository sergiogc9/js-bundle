import { BuildOptions } from 'esbuild';
import { Plugin } from 'rollup';

interface BuildArgs {
	entryPoint?: string;
	esbuildOptions?: BuildOptions;
	isWatchMode?: boolean;
	outDir?: string;
	rollupPlugins?: Plugin[];
	withESBuild?: boolean;
	withTSDefinitions?: boolean;
}

export type { BuildArgs };
