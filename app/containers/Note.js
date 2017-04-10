
import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoteActions from '../actions/note';
import Note from '../components/Note'

const mapStateToProps = (state, ownProps) => {

  return {
    x: state.note.x,
    content: state.note.content
  }

};
const NoteContainer = connect(mapStateToProps, dispatch => bindActionCreators(NoteActions, dispatch))(Note);

export default NoteContainer;
