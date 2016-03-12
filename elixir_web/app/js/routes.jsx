import React from 'react';
import { Router, IndexRoute, Route, Link, hashHistory } from 'react-router'

import Application from './components/Application.jsx'
import Page from './components/Page.jsx'
import Contents from './components/Contents.jsx'

import introduction from '../chapters/introduction.md'
import basics from '../chapters/basics.md'
import processes from '../chapters/processes.md'
import language_tools from '../chapters/language_tools.md'
import drafts_and_ideas from '../chapters/drafts_and_ideas.md'


export default class Routes extends React.Component {
    render(){
        return(
            <Router history={hashHistory}>
              <Route path="/" component={Application}>
                <IndexRoute component={Contents} />
                <Route path="/introduction" content={introduction} component={Page}/>
                <Route path="/basics" content={basics} component={Page}/>
                <Route path="/processes" content={processes} component={Page}/>
                <Route path="/language_tools" content={language_tools} component={Page}/>
                <Route path="/drafts_and_ideas" content={drafts_and_ideas} component={Page}/>
                <Route path="*" component={Page}/>
              </Route>
            </Router>
          );
    }
}