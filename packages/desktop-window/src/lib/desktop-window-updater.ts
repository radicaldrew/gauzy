import { BrowserWindow } from 'electron';
import * as url from 'url';
import * as remoteMain from '@electron/remote/main';
const Store = require('electron-store');
const store = new Store();
export async function createUpdaterWindow(updaterWindow, filePath) {
	const mainWindowSettings: Electron.BrowserWindowConstructorOptions = windowSetting();
	updaterWindow = new BrowserWindow(mainWindowSettings);
	remoteMain.enable(updaterWindow.webContents);
	const launchPath = url.format({
		pathname: filePath,
		protocol: 'file:',
		slashes: true,
		hash: '/updater'
	});

	updaterWindow.hide();
	await updaterWindow.loadURL(launchPath);
	updaterWindow.setMenu(null);

	// updaterWindow.webContents.toggleDevTools();

	updaterWindow.on('close', (event) => {
		updaterWindow.hide();
		event.preventDefault();
	});

	return updaterWindow;
}

const windowSetting = () => {
	const filesPath = store.get('filePath');
	const mainWindowSettings: Electron.BrowserWindowConstructorOptions = {
		frame: true,
		resizable: false,
		focusable: true,
		fullscreenable: false,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			devTools: true,
			contextIsolation: false,
			sandbox: false
		},
		width: 700,
		height: 600,
		title: 'i4net Updater',
		maximizable: false,
		show: false
	};
	mainWindowSettings.icon = filesPath.iconPath;
	return mainWindowSettings;
};
