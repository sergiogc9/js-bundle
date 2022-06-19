import fs from 'fs';
import path from 'path';

import { execSilent } from './shell';

const isRootDir = (dir: string) => {
	const isWin = process.platform === 'win32';
	return (isWin && dir === process.cwd().split(path.sep)[0]) || (!isWin && dir === '/');
};

export const checkNodeInstallation = () => {
	const { code } = execSilent('node --version');
	if (code) throw { code, message: 'Node is not installed' };
};

export const getCurrentPackageJson = (): Record<string, unknown> => {
	const checkDirectory = (dir: string): Record<string, unknown> => {
		const file = `${dir}/package.json`;
		if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file).toString());
		if (isRootDir(dir)) throw { code: 1, message: 'You are not in a node project.' };
		return checkDirectory(path.resolve(dir, '..'));
	};

	return checkDirectory(process.cwd());
};
