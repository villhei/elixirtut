import React from 'react';
import { Router, IndexRoute, Route, Link, hashHistory, applyRouterMiddleware } from 'react-router'
import {useScroll} from 'react-router-scroll';

import Application from './components/Application.jsx'
import Page from './components/Page.jsx'
import Contents from './components/Contents.jsx'
import {chapters} from './chapters.js'

export default class Routes extends React.Component {

  render() {

    let content = chapters.map(chapter =>
      (<Route path={chapter.path} key={chapter.path} chapter={chapter} component={Page}/>))

    return (
      <Router history={hashHistory}
        render={applyRouterMiddleware(useScroll()) }>
        <Route path="/" component={Application}>
          <IndexRoute component={Contents} />
          {content}
          <Route path="*" component={Page}/>
        </Route>
      </Router>
    );
  }
}