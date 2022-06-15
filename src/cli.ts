import yargs from 'yargs';

// import defaultHandler from './commands/default';
import build from './commands/build';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(process.argv.slice(2))
	.version()
	.option('help', { alias: 'h' })
	// .option('version', { alias: 'v' })
	.command(
		'$0',
		'',
		y => y.usage('Usage: js-bundle <command> [options]'),
		// () => defaultHandler(process.argv.slice(2))
		() => console.log('JSDJK')
	)
	.command(build.name, build.description, build.config, build.handler);
