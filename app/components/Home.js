// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
// import styles from './Home.css';
import editorStyles from './Editor.css';

import { Editor } from 'react-draft-wysiwyg';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Editor
          wrapperClassName={editorStyles.wrapper}
          editorClassName={editorStyles.editor}
          toolbarClassName={editorStyles.toolbar}
        />
      </div>
    );
  }
}
        // <div className={styles.container} data-tid="container">
        //   <h2>Homehehe</h2>
        //   <Link to="/counter">to Counter</Link>
        // </div>
