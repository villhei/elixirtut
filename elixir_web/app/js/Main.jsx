import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Application from './components/Application.jsx'
export default class Routes extends React.Component {

  render() {
    return (
      <Router>
          <Route path="/" component={Application} />
      </Router>
    );
  }
}