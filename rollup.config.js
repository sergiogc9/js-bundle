import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import pkg from './package.json';

const config = [
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'cjs'
		},
		external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
		plugins: [typescript()]
	},
	{
		input: 'src/index.ts',
		output: [{ file: 'dist/index.d.ts' }],
		plugins: [dts()]
	}
];

export default config;
