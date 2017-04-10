import { ADD_NOTE } from '../actions/notes';
import note from './note';

type actionType = {
  type: string
};

type State = Array<Object>;

export type notesStateType = {
  notes: State
};

const initialState = [];


export default function notes(state: State = initialState, action: actionType) {
  switch (action.type) {
    case ADD_NOTE:
      return [
        ...state,
        note(undefined, action)
      ];
    default:
      return state;
  }
}