// @flow

export const MOVE_NOTE = 'MOVE_NOTE';
export function move(x: number = 0) {
  return {
    type: MOVE_NOTE,
    x
  };
}

export const SET_CONTENT = 'SET_CONTENT';
export function setContent(content: any) {
  return {
    type: SET_CONTENT,
    content
  };
}

export const UPDATE_CONTENT = 'UPDATE_CONTENT';
export function updateContent(content: any) {
  return {
    type: UPDATE_CONTENT,
    content
  };
}
