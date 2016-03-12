import React from 'react';
import { Router, IndexRoute, Route, Link, hashHistory } from 'react-router'

import Application from './components/Application.jsx'
import Page from './components/Page.jsx'
import Contents from './components/Contents.jsx'
import Chapters from './chapters.js'

export default class Routes extends React.Component {

    render(){

        let content = Chapters.map(chapter => 
          (<Route path={chapter.path} key={chapter.path} chapter={chapter} component={Page}/>))

        return(
            <Router history={hashHistory}>
              <Route path="/" component={Application}>
                <IndexRoute component={Contents} />
                {content}
                <Route path="*" component={Page}/>
              </Route>
            </Router>
          );
    }
}