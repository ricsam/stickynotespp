import * as electronStorage from 'electron-json-storage';
import * as fs from 'fs';

export function hasData (what) {
  return new Promise((resolve, reject) => {
    electronStorage.has(what, (err, initialized) => {
      if (err) {
        reject('There was an error');
      } else if ( ! initialized ) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export function getData(what) {
  return new Promise(async (resolve, reject) => {
    let hasWhat = await hasData(what);
    if ( ! hasWhat ) {
      return reject('Cannot getData of ' + what + ', there is no record of ' + what);
    }
    electronStorage.get(what, (err, data) => {

      if (err) {
        return reject('electron-json-storage Error: ' + err);
      }

      if ( typeof data === 'undefined' ) {
        return reject('getData()-> The data ' + what + ' is undefined!');
      }

      resolve(data);
    });
  });
}
export function setData(what, data) {
  return new Promise((resolve, reject) => {
    electronStorage.set(what, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    })
  });
}

// export async function initializeUserSettings() {

// }

export function getDefaultData() {
  return new Promise((resolve, reject) => {
    fs.readFile('./app/default_user_settings.json', (err, data) => {
      if (err) {
        reject('File IO error: ' + err);
      }
      try {
        let settings = JSON.parse(data);
        if (typeof settings === 'string') throw 'JSON parse resulted in string';
        resolve(settings);
      } catch (err) {
        reject('JSON parsing error: ' + err);
      }
    });

  });
}


export async function getSettings() {
  if (await hasData('settings')) {
    return await getData('settings');
  } else {
    let settings = await getDefaultData();
    await setData('settings', settings);
    return settings;
  }
}

export async function createDefaultEmptyNote() {
  let settings = await getSettings();
  let note = {
    content: {},
    settings: settings.default.settings
  };
  return note;
}

export async function getNotes() {
  if (await hasData('notes')) {
    try {
      let notes = await getData('notes');
      if (notes.length > 0) {
        return notes;
      }
    } catch (error) {
      console.log('There was an error when retrieving the notes, thus creating the default notes now');
    }
  }

  let note = await createDefaultEmptyNote();
  let notes = [note];

  await setData('notes', notes);
  return notes;

}


// export async function initializeData() {
//   try {
//     let notes = await getData('notes');
//   } catch(err) {

//   }
// }


  // electronStorage.has(what, (err, initialized) => {
  //   if (!initialized) {

  //     electronStorage.set(what, [], (err) => {
  //       res(settings.default.noteSettings);
  //     });

  //   } else {
  //     electronStorage.get(what, (err, data) => {
  //       if (data.length === 0) {
  //         res(settings.default.noteSettings);
  //       } else {
  //         res(data);
  //       }
  //     });
  //   }
  // })

// const initializeData = (what, fbfun) => {
//   return Promise((resolve, reject) => {
//   });
// };


