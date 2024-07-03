import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
const { SerialPort } = require('serialport');

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}
let mainWindow;
;(async () => {
  await app.whenReady()

  if (!mainWindow) {
    mainWindow = createWindow('main', {
      width: 1200,
      height: 700,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        icon: path.join(__dirname, 'icon.ico')
      },

    })

    if (isProd) {
      await mainWindow.loadURL('app://./login')
    } else {
      const port = process.argv[2]
      await mainWindow.loadURL(`http://localhost:${port}/login`)
      mainWindow.webContents.openDevTools()
    }

    // SerialPort configuration
    const serialPort = new SerialPort({
      path: 'COM1', // Replace with the correct port
      baudRate: 9600
    });

    serialPort.on('data', (data) => {
      mainWindow.webContents.send('serial-data', data.toString());
      console.log(data.toString());
    });
  } else {
    mainWindow.focus();
  }
})()


app.on('window-all-closed', () => {
  mainWindow = null;
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
