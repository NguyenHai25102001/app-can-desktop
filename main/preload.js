import { contextBridge, ipcRenderer } from 'electron'

const handler = {
  send(channel, value) {
    ipcRenderer.send(channel, value)
  },
  on(channel, callback) {
    const subscription = (_event, ...args) => callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  onSerialData: (callback) => {
    ipcRenderer.on('serial-data', (event, data) => callback(data));
  },
}

contextBridge.exposeInMainWorld('ipc', handler)