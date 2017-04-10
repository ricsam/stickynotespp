// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import NoteContainer from './containers/Note';
import LoadingContainer from './containers/Loading';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/note/:noteId" component={NoteContainer} />
  </Route>
);
    // <Route path="/:noteId" component={LoadingContainer} />
