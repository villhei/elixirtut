import React from 'react';
import { Link } from 'react-router'

export default class Contents extends React.Component {
    render(){
        return(
          <div>
              <h1>Functional programming Elixir</h1>
              <h2>Table of contents</h2>
              <ul>
                <li><Link to="/introduction">Introduction</Link></li>
                <li><Link to="/basics">Basics and syntax</Link></li>
                <li><Link to="/processes">Parallelism with processes</Link></li>
                <li><Link to="/language_tools">Building applications</Link></li>
                <li><Link to="/drafts_and_ideas">Drafts and ideas</Link></li>
              </ul>
          </div>
        );
    }
}