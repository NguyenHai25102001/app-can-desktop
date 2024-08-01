import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
const { SerialPort } = require('serialport');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow;

const connectSerialPort = (path, baudRate) => {
  return new Promise((resolve, reject) => {
    const serialPort = new SerialPort({ path, baudRate }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(serialPort);
      }
    });
  });
};

const tryConnectSerialPort = async (path, baudRate, interval = 1000) => {
  while (true) {
    try {
      const serialPort = await connectSerialPort(path, baudRate);
      console.log(`Connected to ${path}`);
      return serialPort;
    } catch (err) {
      console.error(`Failed to connect to ${path}: ${err.message}. Retrying in ${interval}ms...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

(async () => {
  await app.whenReady();

  if (!mainWindow) {
    mainWindow = createWindow('main', {
      width: 1200,
      height: 700,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        icon: path.join(__dirname, 'icon.ico')
      },
    });
 app.commandLine.appendSwitch('disable-software-rasterizer');
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-plugins');
  app.commandLine.appendSwitch('disable-extensions');
  app.commandLine.appendSwitch('disable-webgl');
  app.commandLine.appendSwitch('disable-image-capture');
  app.commandLine.appendSwitch('disable-media-stream');
  app.commandLine.appendSwitch('disable-features', 'VRDisplay,VRLayer');
  app.commandLine.appendSwitch('disable-webrtc');
  app.commandLine.appendSwitch('remote-debugging-port', '0');
  app.commandLine.appendSwitch('no-update');


    mainWindow.setMenu(null); // Loại bỏ menu

    if (isProd) {
      await mainWindow.loadURL('app://./login');
    } else {
      const port = process.argv[2];
      await mainWindow.loadURL(`http://localhost:${port}/login`);
      mainWindow.webContents.openDevTools();
    }

    // Cấu hình SerialPort
    const serialPort = await tryConnectSerialPort('COM1', 9600);

    serialPort.on('data', (data) => {
      const dataStr = data.toString().match(/\d+/g).join("");
      mainWindow.webContents.send('serial-data', dataStr);
      console.log('Data:', dataStr);
    });
  } else {
    mainWindow.focus();
  }
})();

app.on('window-all-closed', () => {
  mainWindow = null;
  app.quit();
});


ipcMain.on('message', (event, arg) => {
  event.reply('message', `${arg} World!`);
});

ipcMain.on('print-details', async (event, details) => {
  console.log('Printing details', details);

  try {
    // Tạo nội dung HTML từ dữ liệu details
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Phiếu Cân</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
          <style>
              body {
                  font-family: "Roboto", sans-serif;
                  width: 21cm;
                  height: 14.8cm;
                  margin: 0;
                  padding: 5px 1rem 0 1rem;
                  box-sizing: border-box;
              }
              .header, .footer {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .content {
                  margin-bottom: 20px;
              }
              .center-box {
                  border: 1px solid #000;
                  padding: 10px;
                  text-align: center;
                  margin: 20px 0;
              }
              .footer {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 20px;
              }
              table {
                  table-layout: auto;
                  width: 100%;
                  border-collapse: collapse;
              }
              td {
                  border: 1px solid #000;
                  padding: 8px;
                  width: 50%;
              }
          </style>
      </head>
      <body>
          <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="text-align: center; margin-top: 0.5rem;">
                  <div style="font-size: 18px; font-weight: 600; text-transform: uppercase;">Công ty TNHH Cường Tân</div>
              </div>
              <div style="text-align: center;">
                  <div style="text-align: center; text-transform: uppercase; font-size: 24px; font-weight: 700;">Cân điện tử 120 tấn - Cường Tân</div>
                  <div style="font-size: 14px; margin-top: 1rem;">KCN - Trực Hùng - Trực Ninh - Nam Định</div>
                  <div style="margin-top: 0.4rem; font-size: 14px;">SĐT: 0916 036 658</div>
              </div>
          </div>

          <div class="content" style="margin-top: 2rem;">
              <div style="text-align: center;">
                  <div style="text-transform: uppercase; font-size: 24px; font-weight: 500;">Phiếu cân hàng kiêm phiếu thu</div>
              </div>
              <div style="display: flex; margin-top: 8px;">
                  <div style="font-weight: 600; display: flex; align-items: center; width: 150px;">Khách hàng:</div>
                  <div>${details.customerName ?? ''}</div>
              </div>
              <div style="font-weight: 600; display: flex; align-items: center; margin-top: 0.5rem;">
                  <div style="width: 150px;">Số phiếu:</div>
                  <div style="font-weight: 600; font-size: 20px;">${details.code_scale ?? ''} <span style="margin-left: 1rem;">(${details.userCreated})</span></div>
              </div>
              <div style="display: flex; margin-top: 8px;">
                  <div style="font-weight: 600; display: flex; align-items: center; width: 150px;">Ghi chú:</div>
                  <div>${details.explain ?? ''}</div>
              </div>
              <div style="margin-top: 28px;">
                  <table>
                      <tr>
                          <td>
                              <div style="display: flex;">
                                  <div style="width: 150px">Biển số xe:</div>
                                  <div style="font-weight: 600;">${details.licensePlates ?? ''}</div>
                              </div>
                          </td>
                          <td>
                              <div style="display: flex;">
                                  <div style="width: 100px">Tên hàng:</div>
                                  <div style="font-weight: 600">${details.productName ?? ''}</div>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="display: flex;">
                                  <div style="width: 150px">Giờ cân có tải:</div>
                                  <div style="font-weight: 600;">${details.dateLoadedScale ?? ''}</div>
                              </div>
                          </td>
                          <td>
                              <div style="display: flex; align-items: end;">
                                  <div style="width: 200px">Trọng lượng hàng và xe:</div>
                                  <div style="font-weight: 600; width: 80px; text-align: end; font-size: 22px;">${details.loadedScale ?? ''}</div>
                                  <div style="margin-left: 4px; font-weight: 600;">Kg</div>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="display: flex;">
                                  <div style="width: 150px">Giờ cân không tải:</div>
                                  <div style="font-weight: 600;">${details.dateUnLoadedScale ?? ''}</div>
                              </div>
                          </td>
                          <td>
                              <div style="display: flex; align-items: end;">
                                  <div style="width: 200px">Trọng lượng xe:</div>
                                  <div style="font-weight: 600; width: 80px; text-align: end; font-size: 22px;">${details.unloadedScale ?? ''}</div>
                                  <div style="margin-left: 4px; font-weight: 600;">Kg</div>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="display: flex;">
                                  <div style="width: 150px">Giờ cân trừ bì:</div>
                                  <div style="font-weight: 600;">${details.dateTare ?? ''}</div>
                              </div>
                          </td>
                          <td>
                              <div style="display: flex; align-items: end;">
                                  <div style="width: 200px">Trừ bì:</div>
                                  <div style="font-weight: 600; width: 80px; text-align: end; font-size: 22px;">${details.tare ?? ''}</div>
                                  <div style="margin-left: 4px; font-weight: 600;">Kg</div>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="display: flex;">
                                  <div style="width: 150px">Trạng thái:</div>
                                  <div style="font-weight: 600;">${details.purpose_name ?? ''}</div>
                              </div>
                          </td>
                          <td>
                              <div style="display: flex; align-items: end;">
                                  <div style="width: 200px">Trọng lượng hàng:</div>
                                  <div style="font-weight: 600; width: 80px; text-align: end; font-size: 22px;">${details.total_weight ?? ''}</div>
                                  <div style="margin-left: 4px; font-weight: 600;">Kg</div>
                              </div>
                          </td>
                      </tr>
                  </table>
              </div>
          </div>

          <div class="footer" style="font-weight: 500; margin-top: 1rem; padding: 0 1rem;">
              <div>BÊN BÁN</div>
              <div>NGƯỜI CÂN</div>
              <div>BÊN MUA</div>
          </div>
      </body>
      </html>
    `;

    // Tạo một cửa sổ ẩn để chuyển đổi HTML thành PDF
    const win = new BrowserWindow({ show: false });

    // Tải HTML vào cửa sổ
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    // Đợi cho trang tải xong
    win.webContents.on('did-finish-load', () => {
      win.webContents.print({}, (success, errorType) => {
        if (!success) {
          console.error('Error printing details:', errorType);
          event.reply('print-details-reply', { success: false, error: errorType });
        } else {
          event.reply('print-details-reply', { success: true });
        }
        win.close();
      });
    });
  } catch (error) {
    console.error('Error printing details:', error);
    event.reply('print-details-reply', { success: false, error: error.message });
  }
});
