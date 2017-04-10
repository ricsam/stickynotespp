// @flow
import { MOVE_NOTE, UPDATE_CONTENT, SET_CONTENT } from '../actions/note';

type actionType = {
  type: string
};

type State = {
  width: number;
  height: number;
  x: number;
  y: number;
  content: {};
};

const initialState = {
  width: 10,
  height: 10,
  x: 0,
  y: 0,
  content: {"entityMap":{},"blocks":[{"key":"fs15t","text":"Hello World!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}
};


export type noteStateType = {
  note: State
};


export default function note(state: State = initialState, action: actionType): State{
  switch (action.type) {
    case MOVE_NOTE:
      return {
        ...state,
        x: action.x
      }
    case UPDATE_CONTENT:
      return {
        ...state,
        content: action.content
      }
    case SET_CONTENT:
      return {
        ...state,
        content: action.content
      }
    default:
      return state;
  }
}

