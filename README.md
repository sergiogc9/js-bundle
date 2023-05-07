# js-bundle

![](https://github.com/sergiogc9/js-bundle/workflows/Github%20Pipeline/badge.svg?branch=master)
![](https://badgen.net/npm/v/@sergiogc9/js-bundle?icon=npm&label)
![](https://badgen.net//bundlephobia/minzip/@sergiogc9/js-bundle)

A set of utils to easily bundle JavaScript and TypeScript projects using a common config used in my other projects.

This package uses `esbuild` to build the source code and `tsc` to generate the TypeScript definitions.

### Getting started

Install it from NPM or github packages:

`yarn add -D @sergiogc9/js-bundle` or `npm install --save-dev @sergiogc9/js-bundle`.

### Usage

Depending on the requirements, you can use the CLI command `js-bundle` or the Javascript API exported by the package.

#### Using the CLI

The package adds the `js-bundle` command to perform builds from the console, NPM scripts, pipelines, etc.

Example in console:

```bash
yarn js-bundle build --platform=node --only-bundle --only-es6
```

Example in NPM script, adding a script into _package.json_:

```json
"scripts": {
    ...
	"build": "js-bundle build --platform=node --only-bundle --only-es6",
},
```

#### Using the JavaScript API

This package also exports a Javascript `buildPackage` function to programmatically perform builds. Using this option you can customize `esbuild` options for more complex cases.

Example for a custom build with dynamic inputs:

```js
const { buildPackage } = require('@sergiogc9/js-bundle');

const isWatchMode = process.argv.includes('--watch');

const performBuild = async () => {
	const dynamicInputs = ['Api', 'Cache', 'Log', 'Pushover'].map(current => `src/${current}/index.ts`);

	await buildPackage({
		entryPoint: ['src/index.ts', ...dynamicInputs],
		esbuildOptions: {
			platform: 'node'
		},
		isWatchMode
	});
};

performBuild();
```

### Configuration options

#### CLI options

| Option                   | Description                                                                     | Type                         | Default   |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------- | --------- |
| `only-bundle`            | Only perform bundling using esbuild. No TS definition will be performed.        | boolean                      | false     |
| `only-types`             | Only generate TypeScript types. No bundling will be performed.                  | boolean                      | false     |
| `only-es6`               | Only perform bundling with ES6 (mjs) target. No cjs bundling will be performed. | boolean                      | false     |
| `out-dir`                | Output directory                                                                | string                       | `./dist`  |
| `platform`               | Esbuild platform option                                                         | `browser`, `neutral`, `node` | `browser` |
| `tsc-incremental`        | Use incremental flag for tsc                                                    | boolean                      | false     |
| `tsc-extend-diagnostics` | Use extend diagnostics flag for tsc                                             | boolean                      | false     |
| `watch`                  | Use watch mode                                                                  | boolean                      | false     |

#### JavaScript API options

| Option              | Description                                                                                                                      | Type                                                       | Default                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| `entryPoint`        | Source(s) entrypoint(s)                                                                                                          | `string`, `string[]`                                       | `src/index.ts`                                         |
| `esbuildOptions`    | Object containing any option for the `build` method exported by `esbuild` package. Use it for overriding this packages defaults. | `BuildOptions`                                             | {}                                                     |
| `isWatchMode`       | Use watch mode                                                                                                                   | boolean                                                    | false                                                  |
| `onlyES6`           | Only perform bundling with ES6 (mjs) target. No cjs bundling will be performed.                                                  | boolean                                                    | false                                                  |
| `outDir`            | Output directory                                                                                                                 | string                                                     | `./dist`                                               |
| `tscOptions`        | Object containing options to use with tsc.                                                                                       | `{ extendedDiagnostics?: boolean; incremental?: boolean;}` | `{ extendedDiagnostics = false, incremental = false }` |
| `withESBuild`       | Perform build with esbuild.                                                                                                      | boolean                                                    | true                                                   |
| `withTSDefinitions` | Generate TS definitions.                                                                                                         | boolean                                                    | true                                                   |
