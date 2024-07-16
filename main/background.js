import path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
const { SerialPort } = require('serialport');
const fs = require('fs');
import { print } from "pdf-to-printer";
const PDFDocument = require('pdfkit');
const electronPDF = require('electron-pdf');
const isProd = process.env.NODE_ENV === 'production';
const { autoUpdater } = require('electron-updater');

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow;

;(async () => {
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

    autoUpdater.on('update-available', () => {
      const dialogOpts = {
        type: 'info',
        buttons: ['OK'],
        title: 'Cập nhật có sẵn',
        message: 'Có một bản cập nhật mới. Ứng dụng sẽ tải xuống và cài đặt tự động.',
      };
      dialog.showMessageBox(dialogOpts);
    });

    autoUpdater.on('update-downloaded', () => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Cài đặt và khởi động lại'],
        title: 'Cập nhật sẵn sàng',
        message: 'Bản cập nhật đã được tải xuống. Ứng dụng sẽ khởi động lại và cài đặt.',
      };

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.on('error', (error) => {
      const dialogOpts = {
        type: 'error',
        buttons: ['OK'],
        title: 'Lỗi cập nhật',
        message: error == null ? 'Lỗi không xác định' : (error.stack || error).toString(),
      };
      dialog.showMessageBox(dialogOpts);
    });

    if (isProd) {
      await mainWindow.loadURL('app://./login');
    } else {
      const port = process.argv[2];
      await mainWindow.loadURL(`http://localhost:${port}/login`);
      mainWindow.webContents.openDevTools();
    }

    // SerialPort configuration
    const serialPort = new SerialPort({
      path: 'COM1', // Replace with the correct port
      baudRate: 9600
    });

    serialPort.on('data', (data) => {
      mainWindow.webContents.send('serial-data', data.toString().match(/\d+/g).join(""));
    });

    // Kiểm tra cập nhật khi cửa sổ đã sẵn sàng
    mainWindow.once('ready-to-show', () => {
      autoUpdater.checkForUpdatesAndNotify();
    });

  } else {
    mainWindow.focus();
  }
})();

app.on('window-all-closed', () => {
  mainWindow = null;
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
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
          <style>
              body { font-family: Arial, sans-serif; width: 21cm; height: 14.8cm; margin: 0; padding: 1cm; box-sizing: border-box; }
              .header, .footer { text-align: center; margin-bottom: 20px; }
              .content { margin-bottom: 20px; }
              .content div { margin: 10px 0; }
              .center-box { border: 1px solid #000; padding: 10px; text-align: center; margin: 20px 0; }
              .footer { display: flex; justify-content: space-between; margin-top: 20px; }
          </style>
      </head>
      <body>
          <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: center;">
                  <h1>Công ty TNHH Cường Tân</h1>
                  <div style="font-size: 14px; margin: 0;">KCN - Trực Hùng - Trực Ninh - Nam Định</div>
                  <div style="margin-top: 0.4rem; font-size: 14px;">SĐT: 0916 036 658</div>
                  <div></div>
              </div>
              <div>
                  <h2 style="text-align: center;">Phiếu Cân</h2>
                  <div style="display: flex; font-size: 14px;">
                      <div style="margin-right: 1rem;">Số phiếu: </div>
                      <div>${details.code_scale}</div>
                  </div>
              </div>
          </div>
          <div class="content" style="margin-top: 2rem;">
              <div style="display: flex; justify-content: space-between;">
                  <div>
                      <div style="display: flex; align-items: center;margin: 0;">
                          <div style="width: 150px;">Khách hàng</div>
                          <div>:${details.customerName}</div>
                      </div>
                      <div style="display: flex; align-items: center; margin: 0;">
                          <div style="width: 150px;">Số xe</div>
                          <div>: ${details.licensePlates}</div>
                      </div>
                      <div style="display: flex; align-items: center;margin: 0;">
                          <div style="width: 150px;">Loại hàng</div>
                          <div>:  ${details.productName}</div>
                      </div>
                      <div style="display: flex; margin: 0;">
                          <div style="width: 150px;">Ghi chú</div>
                          <div>: ${details.explain}</div>
                      </div>
                  </div>
                  <div>
                      <div style="display: flex; margin: 0;">
                          <div style="width: 150px;">Ngày cân</div>
                          <div>: ${details.explain}</div>
                      </div>
                      <div style="display: flex; align-items: center;margin: 0;">
                          <div style="width: 150px;">Giờ cân có tải</div>
                          <div>: ${details.dateLoadedScale}</div>
                      </div>
                      <div style="display: flex; align-items: center; margin: 0;">
                          <div style="width: 150px;">Giờ cân không tải</div>
                          <div>: ${details.dateUnLoadedScale}</div>
                      </div>
                      <div style="display: flex; align-items: center;margin: 0;">
                          <div style="width: 150px;">Mục đích cân</div>
                          <div>: ${details.purpose_name}</div>
                      </div>
                  </div>
              </div>
          </div>
          <div style="display: flex; justify-content: center;">
              <div style="font-size: 16px; border: 1px solid gray; padding: 1rem; border-radius: 4px;">
                  <div style="display: flex; align-items: center;margin: 0;">
                      <div style="width: 250px; font-weight: 700;">Trọng lượng hàng và xe</div>
                      <div>:</div>
                      <div style="width: 100px; text-align: center;"> ${details.loadedScale}</div>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 0.75rem;">
                      <div style="width: 250px; font-weight: 700;">Trọng lượng xe</div>
                      <div>:</div>
                      <div style="width: 100px; text-align: center;"> ${details.unLoadedScale}</div>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 0.75rem;">
                      <div style="width: 250px; font-weight: 700;">Trừ bì</div>
                      <div>:</div>
                      <div style="width: 100px; text-align: center;"> ${details.tare}</div>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 0.25rem;">
                      <div style="width: 250px; font-weight: 700;"></div>
                      <div></div>
                      <div style="width: 100px; text-align: center; border-bottom: 2px solid black;"></div>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 0.5rem;">
                      <div style="width: 250px; font-weight: 700;">Trọng lượng thực</div>
                      <div>:</div>
                      <div style="width: 100px; text-align: center;"> ${details.total_weight}</div>
                  </div>
              </div>
          </div>
          <div class="footer" style="font-weight: 500">
              <div>BÊN BÁN</div>
              <div>NGƯỜI CÂN</div>
              <div>BÊN MUA</div>
          </div>
          <div style="display: flex; border-top: 2px solid black; margin-top: 100px;">
              <div style="margin-top: 10px;">
                  <div>CÔNG TY CÔNG NGHỆ CAO WINWINGROUP</div>
                  <div style="margin-top: 4px; font-size: 14px;">ĐC: Số 9, ngõ 25, Phố Bùi Huy Bích, Phường Hoàng Mai, Hà Nội</div>
              </div>
          </div>
      </body>
      </html>
    `;

    // Tạo một cửa sổ ẩn để chuyển đổi HTML thành PDF
    const win = new BrowserWindow({ show: false });
    const pdfPath = path.join(app.getPath('userData'), 'details.pdf');

    // Tải HTML vào cửa sổ
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    // Đợi cho trang tải xong
    win.webContents.on('did-finish-load', async () => {
      try {
        // Chuyển đổi HTML thành PDF
        const pdfData = await win.webContents.printToPDF({});
        fs.writeFileSync(pdfPath, pdfData);

        // In tệp PDF (sử dụng chức năng in tùy vào nhu cầu của bạn)
        await printPDF(pdfPath); // Giả sử bạn có một hàm printPDF để in tệp

        event.reply('print-details-reply', { success: true });
      } catch (error) {
        console.error('Error printing details:', error);
        event.reply('print-details-reply', { success: false, error: error.message });
      } finally {
        win.close();
      }
    });
  } catch (error) {
    console.error('Error printing details:', error);
    event.reply('print-details-reply', { success: false, error: error.message });
  }
});

// Hàm in tệp PDF
async function printPDF(pdfPath) {
  try {
    await print(pdfPath);
  } catch (error) {
    console.error('Error printing PDF:', error);
    throw error;
  }
}
