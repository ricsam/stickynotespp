const fs = jest.genMockFromModule('fs');


let __files = {};

fs.__setMockFiles = (files) => {
  __files = files;
};

fs.readFile = function (fname, callback) {
  let error = null;
  if ( ! __files.hasOwnProperty(fname) ) {
    error = 'File does not exist';
  }
  callback(error, JSON.stringify(__files[fname]));
};

module.exports = fs;
