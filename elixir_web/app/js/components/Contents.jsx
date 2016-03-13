import React from 'react';
import { Link } from 'react-router'
import {chapters} from '../chapters.js'

export default class Contents extends React.Component {
    render() {
          let links = chapters.map(chapter => 
             (<li key={chapter.path}><Link to={chapter.path}>{chapter.title}</Link></li>))
        return(
          <div>
              <h1>Functional programming Elixir</h1>
              <h2>Table of contents</h2>
              <ol className="table-of-contents">
                {links}
              </ol>
          </div>
        );
    }
}