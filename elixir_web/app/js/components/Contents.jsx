import React from 'react';
import { Link } from 'react-router'
import { chapters } from '../chapters.js'

import StaticMarkdownRenderer from './StaticMarkdownRenderer.jsx'

export default class Contents extends React.Component {

  render() {
    let links = chapters.map(chapter =>
      (<li key={chapter.path}><Link to={chapter.path}>{chapter.title}</Link></li>))
    return (
      <div>
        <h1>funprog.ex</h1>
        <hr />
        <h2>Functional programming in Elixir</h2>
        <hr />
        <div className="warning">
          <span><b>This guide is a work in progress.</b></span>
          <p>This aims to be a comperehensive guide to the funcional programming paradigm using the Elixir programming language as an example.</p>
          <p>In case of errors, bad or unclear language or of missing things - you are highly encouraged to send feedback to the author by <a href="mailto:ville.heikkinen@gmail.com"> e-mail</a></p>
        </div>
        <h2>Table of contents</h2>
        <ol className="table-of-contents">
          {links}
        </ol>
      </div>
    );
  }
}
