/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
// @flow
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import { createDefaultEmptyNote, getNotes, setData, getSettings } from './setup';
import * as electronStorage from 'electron-json-storage';
import windowStateKeeper from './electron-window-state';

let notes_windows = [];
var webContentsIdNoteIndexMap = {};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const getLoadEvent = (index) => {
  return () => {
    if (!notes_windows[index]) {
      throw new Error('"notes_windows[" ' + index + '] is not defined');
    }
    notes_windows[index].show();

    if (index === 0) {
      notes_windows[0].focus();
    }

  };
};

const setNoteData = async (index, type, data) => {
  let notes = await getNotes();
  notes[index][type] = Object.assign({}, notes[index][type], data);
  if (typeof notes === 'undefined') {
    console.log(notes);
  }
  await setData('notes', notes);
}

const getSaveWindowStateListener = (index) => {
  return async (state) => {
    let settings = {
      window: state
    }
    await setNoteData(index, 'settings', settings);

  };

};

const getCloseEvent = (index) => {
  return async () => {
    notes_windows[index] = null;
    await deleteNote(index);
  };
};


app.on('ready', () => {
  // electronStorage.clear(() => {
  ready();
  // });
});

async function deleteNote(index) {
  let notes = await getNotes();
  notes.splice(index, 1);
  for (let wcId in webContentsIdNoteIndexMap) {
    if (webContentsIdNoteIndexMap.hasOwnProperty(wcId)) {
      let note_index = webContentsIdNoteIndexMap[wcId];
      if (note_index === index) {
        delete webContentsIdNoteIndexMap[wcId];
      }
    }
  }

  for (let wcId in webContentsIdNoteIndexMap) {
    if (webContentsIdNoteIndexMap.hasOwnProperty(wcId)) {
      let note_index = webContentsIdNoteIndexMap[wcId];
      if (note_index > index) {
        webContentsIdNoteIndexMap[wcId] = note_index - 1;
      }
    }
  }

  await setData('notes', notes);

}

async function addNote() {
  let notes = await getNotes();
  let new_note = await createDefaultEmptyNote();
  let new_note_index = notes.length;
  notes.push(new_note);
  await setData('notes', notes);

  createWindow(new_note, new_note_index);
}


function createWindow(note_data, index) {
  let windowState = windowStateKeeper({'saveToDisk': false}, note_data.settings.window);

  notes_windows[index] = new BrowserWindow({
    show: false,
    width: note_data.settings.window.width,
    height: note_data.settings.window.height,
    x: note_data.settings.window.x,
    y: note_data.settings.window.y,
    frame: false,
    transparent: true
  });

  notes_windows[index].loadURL(`file://${__dirname}/app.html#/note/${index}`);
  notes_windows[index].webContents.on('did-finish-load', getLoadEvent(index));
  notes_windows[index].on('closed', getCloseEvent(index, windowState));

  let wcinim = {};
  wcinim[notes_windows[index].webContents.id] = index;
  Object.assign(webContentsIdNoteIndexMap, wcinim);

  const menuBuilder = new MenuBuilder(notes_windows[index]);
  menuBuilder.createNote = async () => {
    await addNote();
  };

  menuBuilder.buildMenu();

  windowState.manage(notes_windows[index]);

  windowState.onStateUpdate(getSaveWindowStateListener(index));


}

async function loadInitialNotesAndAppendToWindows() {

  let notes = await getNotes();
  notes.forEach((note_data, index) => {
    createWindow(note_data, index);
  });
}


async function ready() {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  await loadInitialNotesAndAppendToWindows();


  ipcMain.on('RETRIEVE_NOTE', async (event, index) => {
    let _notes = await getNotes();
    console.log(_notes);
    event.sender.send('LOAD_NOTE', _notes[index]);
  });

  ipcMain.on('SAVE_NOTE_CONTENT', async (event, data) => {
    let notes_index = webContentsIdNoteIndexMap[event.sender.id];

    await setNoteData(notes_index, 'content', data.content);

    event.sender.send('NOTE_CONTENT_SAVED', {
      status: "CONTENT_SAVE_SUCCEEDED",
      id: data.id
    });
    // notes_windows
    // console.log();
  });
}
