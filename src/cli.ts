import yargs from 'yargs';

import build from './commands/build';
import defaultHandler from './commands/default';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(process.argv.slice(2))
	.version()
	.option('help', { alias: 'h' })
	.option('version', { alias: 'v' })
	.command(
		'$0',
		'',
		y => y.usage('Usage: js-bundle <command> [options]'),
		() => defaultHandler(process.argv.slice(2))
	)
	.command(build.name, build.description, build.config, build.handler).argv;
