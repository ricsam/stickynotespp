

// jest.mock('../../app/fs');
jest.mock('fs');
jest.mock('electron-json-storage');

import { hasData, getData, setData, getDefaultData, getSettings, getNotes } from '../../app/setup';

let DEFAULT_STORAGE = {
  storage: {data: 123}
};
const DEFAULT_FILES =  {
  "./app/default_user_settings.json": {
    "user": {},
    "default": {
      "settings": {
        "window": {
          "x": 0,
          "y": 0,
          "width": 400,
          "height": 400
        }
      }
    }
  }
};



describe('hasData', () => {
	it('should not accept non existing files', async () => {
    expect(await hasData('random')).toBeFalsy();
  });

  it('should accept existing files', async () => {
    require('electron-json-storage').__setMockStorage(DEFAULT_STORAGE);
    let result = await hasData('storage');
    expect(result).toBeTruthy();
  });

});

describe('getData', () => {
  it('should get the data', async () => {
    require('electron-json-storage').__setMockStorage(DEFAULT_STORAGE);
    let result = await getData('storage');
    expect(result).toMatchObject({data: 123});
  });
  it('should not retrieve non existing data', async () => {
    try {
      await getData('random');
    } catch(msg) {
      expect(msg).toEqual('Cannot getData of random, there is no record of random');
    }
  })
});

describe('setData', () => {
  it('should set the data', async () => {
    let result = await setData('wef', {data: 312});
    expect(result).toBeTruthy();
  });
  it('should thorow error when key is wrong', async () => {
    try {
      await(setData('giveerror', {}));
    } catch (error) {
      expect(error).toEqual('write error');
    }
  });

});

describe('getDefaultData', () => {
  it('should get the default data', async () => {
    require('fs').__setMockFiles(DEFAULT_FILES);
    let result = await getDefaultData();
    expect(result.hasOwnProperty('default')).toBeTruthy();
  });
  it('should throw error if files does not exist', async () => {
    require('fs').__setMockFiles({});
    let result = null;
    try {
      result = await getDefaultData();
    } catch (error) {
      result = error;
    }
    expect(typeof result).toEqual("string");
  });
  it('should throw error if JSON parse error', async () => {
    require('fs').__setMockFiles({"default_user_settings.json": "NOTJSON"});
    let result = null;
    try {
      result = await getDefaultData();
    } catch (error) {
      result = error;
    }
    expect(typeof result).toEqual("string");
  });
});

describe('getSettings', () => {
  it('should get the settings when storage is empty', async () => {
    require('fs').__setMockFiles(DEFAULT_FILES);
    let result = await getSettings();
    expect(result.hasOwnProperty('default')).toBeTruthy();
  });
  it('should save the settings to the storage if storage does not contain settings', async () => {

    let result = await getData("settings");
    expect(typeof result.default.settings.window.height).toEqual("number");

  });
  it('should not use default storage if settings exist in storage', async () => {
    require('electron-json-storage').__setMockStorage({settings: "the settings"});
    expect(await getSettings()).toEqual("the settings");
  });
});


describe('getNotes', () => {

  it('should retrieve the default note when notes in storage is empty', async () => {
    require('electron-json-storage').__setMockStorage(DEFAULT_STORAGE);
    let result = await getNotes();
    expect(result[0].settings.window.width).toBe(400);
  });
  it('should now have the the default 1 note in the storage', async () => {
    let result = await getData('notes');
    expect(result[0].settings.window.x).toBe(0);
  });
  it('should get the settings from the storage when it exists there', async () => {
    require('electron-json-storage').__setMockStorage({notes: "some notes"});
    let result = await getNotes();
    expect(result).toEqual('some notes');
  });
});
