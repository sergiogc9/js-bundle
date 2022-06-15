import { execSilent } from './shell';

export const checkNodeInstallation = () => {
	const { code } = execSilent('node --version');
	if (code) throw { code, message: 'Node is not installed' };
};
