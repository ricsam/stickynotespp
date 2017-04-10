// let electronStorage = jest.genMockFromModule('electron-json-storage');
let electronStorage = {};


let storage = {};

electronStorage.__setMockStorage = (data) => {
  storage = data;
};

electronStorage = {

  ...electronStorage,

  has: function(key, callback) {
    callback(null, storage.hasOwnProperty(key));
  },
  get: function (key, callback) {
    let err = null,
        data;
    if ( ! storage.hasOwnProperty(key) ) {
      err = 'There is no record of ' + key;
      data = null;
    } else {
      data = storage[key];
    };
    callback(err, data);
  },
  set: function (key, data, callback) {
    if (key !== 'giveerror') {
      storage[key] = data;
      callback(null);
    } else {
      callback('write error');
    }
  }

};


module.exports = electronStorage;
