// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import styles from './App.css';

export default class App extends Component {
  props: {
    children: Children
  };

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}></div>
        {this.props.children}
      </div>
    );
  }
}
