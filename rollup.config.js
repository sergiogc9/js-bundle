import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const config = [
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'cjs'
		},
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.devDependencies || {}),
			...Object.keys(pkg.peerDependencies || {})
		],
		plugins: [typescript()]
	},
	{
		input: 'src/cli.ts',
		output: [
			{
				dir: 'dist',
				format: 'cjs'
			}
		],
		external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
		plugins: [typescript(), json(), terser()]
	},
	{
		input: 'src/index.ts',
		output: [{ file: 'dist/index.d.ts' }],
		plugins: [dts()]
	}
];

export default config;
