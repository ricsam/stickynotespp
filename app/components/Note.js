
import React, { Component } from 'react';

import editorStyles from './Editor.css';
import { Editor } from 'react-draft-wysiwyg';
import * as draft from 'draft-js';
import { fromJS, toJS } from 'immutable';
import deepEqual from 'deep-equal';
import { ipcRenderer } from 'electron';
import appStyles from '../containers/App.css';

export default class Note extends Component {

  props: {
    move: () => void,
    x: number,
    updateContent: () => void,
    content: any
  };

  state: any = {
    editorState: {},
    editorContentState: {},
    editorHeight: {}
  };


  constructor(props) {
    super(props);

    this.state = {
      ...this.getEditorStateFromStore(),
      editorHeight: this.getEditorHeight()
    }


    this.noteLoadedFromMainProcess = this.noteLoadedFromMainProcess.bind(this);
    this.setEditorHeight = this.setEditorHeight.bind(this);
  }

  componentWillUnmount() {
    ipcRenderer.removeEventListener('LOAD_NOTE', this.noteLoadedFromMainProcess);
    window.removeEventListener('resize', this.setEditorHeight);
    window.removeEventListener('DOMContentLoaded', this.setEditorHeight);
  }
  componentDidMount() {
    ipcRenderer.once('LOAD_NOTE', this.noteLoadedFromMainProcess);
    ipcRenderer.send('RETRIEVE_NOTE', this.props.params.noteId);

    window.addEventListener('resize', this.setEditorHeight);
    this.setEditorHeight();
  }

  setEditorHeight() {
    console.log('editor height beeing set!');
    setTimeout(() => {
      this.setState({
        editorHeight: this.getEditorHeight()
      });
    }, 1);
  }

  getEditorHeight() {
    let tb = document.querySelector(`.${editorStyles.toolbar}`),
      drag = document.querySelector(`.${appStyles.header}`);

    if ( ! (tb && drag) ) {
      return '100%';
    }

    let top = tb.offsetHeight + drag.offsetHeight;


    return `${window.innerHeight - top - 7}px`;
  }


  noteLoadedFromMainProcess(event, note) {
    this.props.setContent(note.content);
    this.setState(this.getEditorStateFromStore);
  }


  getEditorContentStateFromStore() {
    try {
      let contentState = draft.convertFromRaw(this.props.content);
      return draft.EditorState.createWithContent(contentState);
    } catch (error) {
      return draft.EditorState.createEmpty();
    }
  }

  getEditorStateFromStore() {

    let editorState = this.getEditorContentStateFromStore();
    return {
      editorState,
      editorRawContentState: draft.convertToRaw(editorState.getCurrentContent())
    }
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  }

  onContentStateChange(editorRawContentState) {
    if (deepEqual(this.state.editorRawContentState, editorRawContentState, {strict: true})) return;
    this.props.updateContent(editorRawContentState);
    this.setState({
      editorRawContentState,
    });
  }

  render() {
    window.astate = this;

    return (<div>
      <Editor
        editorState={this.state.editorState}
        wrapperClassName={editorStyles.wrapper}
        editorClassName={editorStyles.editor}
        toolbarClassName={editorStyles.toolbar}
        toolbarStyle={{'borderRadius': 0}}
        editorStyle={{'height': this.state.editorHeight}}
        onContentStateChange={this.onContentStateChange.bind(this)}
        onEditorStateChange={this.onEditorStateChange.bind(this)}
        ref="editor"

      />


    </div>);
  }
}
