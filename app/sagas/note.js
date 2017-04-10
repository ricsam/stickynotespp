import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {ipcRenderer} from 'electron';

let channel_index = 0,
    cb_list = {};

const addChannelListener = (id, cb) => {
  cb_list[id] = (status) => {
    cb(status);
    delete cb_list[id]
  }
};

ipcRenderer.on('NOTE_CONTENT_SAVED', (event, data) => {
  cb_list[data.id](data.status);
});

function saveContent(content) { return new Promise((resolve, reject) => {

  channel_index++;

  addChannelListener(channel_index, (status) => {
    resolve(status);
  });

  ipcRenderer.send('SAVE_NOTE_CONTENT', {
    content: content,
    id: channel_index
  });



  resolve();
})};
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
   try {
      const content = yield call(saveContent, action.content);
      yield put({type: "CONTENT_SAVE_SUCCEEDED", content: content});
   } catch (e) {
      yield put({type: "CONTENT_SAVE_FAILED", message: e.message});
   }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* noteSaga() {
  yield takeLatest("UPDATE_CONTENT", fetchUser);
}

export default noteSaga;
