const { app, BrowserWindow, ipcMain, shell } = require('electron');
const url = require('url');
const path = require('path');
const FileTypes = require('./file-types.json');
const fs = require('fs');
const contextMenu = require('electron-context-menu');


var mode = 1; // by default works on file
var handleDirs = true; // by default process directories with depth 1

// require('electron-reload')(path.join(__dirname, 'app'));


contextMenu({
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: 'Aggregate By Types',
      visible: true,
      click: () => {
        mode = 1;

        console.log("Switched to : Type Mode");
        let currWin = BrowserWindow.getFocusedWindow();
        currWin.webContents.send('mode', "Aggregate Files By Type");
      }
    },
    {
      label: 'Aggregate By Extensions',
      visible: true,
      click: () => {
        mode = 2;
        console.log("Switched to : Extension Mode");
        let currWin = BrowserWindow.getFocusedWindow();
        currWin.webContents.send('mode', "Aggregate Files by Extension");
      }
    },
    {
      label: 'Toggle Directories Handling',
      visible: true,
      click: () => {
        handleDirs = !handleDirs;

        console.log("Handle Dirs: " + handleDirs);
        let currWin = BrowserWindow.getFocusedWindow();
        if (handleDirs) {

          currWin.webContents.send('mode', "Handle Directories");
        }
        else {
          currWin.webContents.send('mode', "Don't Handle Directories");

        }
      }
    },
    {
      label: 'Open In GitHub',
      visible: true,
      click: () => {
        shell.openExternal(`https://github.com/deep5050/Mr.Dclutterer`);
      }
    }
  ]
});


let win;
function createWindow() {
  win = new BrowserWindow({
    width: 300, // 300
    height: 440,  // 400
    resizable: true,
    frame: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })



  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'view', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));



  // win.webContents.openDevTools()
}


app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})





///////////////////////// Aggregate by file types //////////////////////////////////


byType = (filePathArr, handleDirs) => {
  var filesUnderAllDirs = [];
  filePathArr.forEach(_path => {

    if (fs.existsSync(_path)) {


      if (fs.lstatSync(_path).isFile()) {
        baseFileName = path.basename(_path);
        // is file ??
        var ext;
        try {
          ext = path.extname(_path).split('.')[1];
        } catch (error) {
          console.error("ERROR: " + _path + " no extension found");
        }

        if (ext && ext !== "") {
          if (FileTypes[ext]) {
            console.log(_path + " Is of Type " + FileTypes[ext]);

            // logic goes here ..................

            // extract the directory from the file path
            currDirName = path.dirname(_path);

            // create directory(UPPERCASE) if not exists based on the type
            determinedDirName = FileTypes[ext].toUpperCase();
            newDirPath = path.join(currDirName, determinedDirName);
            movePath = path.join(newDirPath, baseFileName);

            if (!fs.existsSync(newDirPath)) {

              try {
                fs.mkdirSync(newDirPath)
              } catch (error) {
                console.log("Error: create " + newDirPath);
              }
            }

            // move file to the newly created directory
            try {
              fs.renameSync(_path, movePath);
            } catch (error) {
              console.log("Error: move " + movePath);
            }

          }
          else {
            console.log("ERROR: " + _path + " could not decide")
          }
        }
      }
      else if (fs.lstatSync(_path).isDirectory() && handleDirs == true) {
        // if feature is enabled, list all the FILES  ( exclude further directories) i.e. depth = 1 and add it to a list

        console.log(_path + " is a Directory : Listing all the files to arrange them :)");
        dirPath = _path;
        entries = fs.readdirSync(dirPath);

        entries.forEach(element => {
          if (fs.lstatSync(path.join(dirPath, element)).isFile()) {
            filesUnderAllDirs.push(path.join(dirPath, element)); // appending files only
          }
        });
      }
    }
  });

  // now call this function again with handleDirs=false
  if (filesUnderAllDirs && filesUnderAllDirs.length != 0) {
    byType(filesUnderAllDirs, false);
  }

}


/////////////////////////////////////////////////////////////////////////////


///////////////////////// Aggregate by Extensions //////////////////////
byExtension = (filePathArr, handleDirs) => {
  var filesUnderAllDirs = [];
  filePathArr.forEach(_path => {

    if (fs.existsSync(_path)) {


      if (fs.lstatSync(_path).isFile()) {
        baseFileName = path.basename(_path);
        // is file ??
        var ext;
        try {
          ext = path.extname(_path).split('.')[1];
        } catch (error) {
          console.error("ERROR: " + _path + " no extension found");
        }

        if (ext) {
          if (ext !== "") {
            console.log(_path + " Extension: " + ext);

            // logic goes here ..................

            // extract the directory from the file path
            currDirName = path.dirname(_path);

            // create directory(UPPERCASE) if not exists based on the type
            determinedDirName = ext.toUpperCase();
            newDirPath = path.join(currDirName, determinedDirName);
            movePath = path.join(newDirPath, baseFileName);

            if (!fs.existsSync(newDirPath)) {

              try {
                fs.mkdirSync(newDirPath)
              } catch (error) {
                console.log("Error: create " + newDirPath);
              }
            }

            // move file to the newly created directory
            try {
              fs.renameSync(_path, movePath);
            } catch (error) {
              console.log("Error: move " + movePath);
            }

          }
          else {
            console.log("ERROR: " + _path + " could not decide")
          }
        }
      }
      else if (fs.lstatSync(_path).isDirectory() && handleDirs == true) {
        // if feature is enabled, list all the FILES  ( exclude further directories) i.e. depth = 1 and add it to a list

        console.log(_path + " is a Directory : Listing all the files to arrange them :)");
        dirPath = _path;
        entries = fs.readdirSync(dirPath);

        entries.forEach(element => {
          if (fs.lstatSync(path.join(dirPath, element)).isFile()) {
            filesUnderAllDirs.push(path.join(dirPath, element)); // appending files only
          }
        });
      }
    }
  });

  // now call this function again with handleDirs=false
  if (filesUnderAllDirs && filesUnderAllDirs.length != 0) {
    byExtension(filesUnderAllDirs, false);
  }

}


///////////////////////////////////////////////////////////////////////




analyzeAndConvert = async (filePathArr) => {
  if (mode === 1) {
    byType(filePathArr, handleDirs);
  }
  else if (mode === 2) {
    byExtension(filePathArr, handleDirs);
  }
}



ipcMain.on('arrange', (event, filePath) => {
  // console.log(filePath);
  var filePathArr = filePath.split("\n");
  analyzeAndConvert(filePathArr);
  let currWin = BrowserWindow.getFocusedWindow();
  win.webContents.send('done', 'done');
});

ipcMain.on('quit', (event) => {
  app.quit();
})