import { MOVE_NOTE } from '../../app/actions/note';
import note from '../../app/reducers/note';

import { ADD_NOTE } from '../../app/actions/notes';
import notes from '../../app/reducers/notes';




describe('reducers', () => {
  describe('notes', () => {
    it('should handle initial state', () => {
      expect(notes(undefined, {})).toMatchObject([]);
    });

    // it('should handle INCREMENT_COUNTER', () => {
    //   expect(counter(1, { type: INCREMENT_COUNTER })).toBe(2);
    // });

    // it('should handle DECREMENT_COUNTER', () => {
    //   expect(counter(1, { type: DECREMENT_COUNTER })).toBe(0);
    // });

    it('should handle unknown action type', () => {
      expect(notes([], { type: 'unknown' })).toMatchObject([]);
    });
  });

  describe('note', () => {
    it('should handle initial state', () => {
      expect(note(undefined, {}).hasOwnProperty('width')).toBeTruthy();
    });

    it('should handle unknown action type', () => {
      expect(note({
        width: 25,
        height: 43,
        x: 23,
        y: 0
      }, { type: 'unknown' })).toMatchObject({
        width: 25,
        height: 43,
        x: 23,
        y: 0
      });
    });

    it('should handle MOVE_NOTE', () => {
      let target = {
        x: 1
      };
      expect(note({x: 123}, { type: MOVE_NOTE, ...target })).toMatchObject(target);
    });

  });
});
