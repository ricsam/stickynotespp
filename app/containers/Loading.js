// @flow
import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import { fromJS } from 'immutable';

import { ipcRenderer } from 'electron';
import * as NoteActions from '../actions/note';
import Note from '../components/Note'

class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {}
    };


    ipcRenderer.on('LOAD_NOTE', (event, note) => {
      console.log(note);
      this.props.setContent(note.content);
      this.props.router.push('/note/' + this.props.params.noteId);
    });
    ipcRenderer.send('RETRIEVE_NOTE', this.props.params.noteId);

  }

  render() {
    return (
      <div>
        Loading... {this.props.params.noteId}<br />
      </div>
    );
  }
}


const LoadingContainer = connect(state => { return {}}, dispatch => bindActionCreators(NoteActions, dispatch))(Loading);

export default LoadingContainer;
