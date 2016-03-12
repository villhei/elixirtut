import React from 'react';
import { findDOMNode } from 'react-dom'
import $ from 'jquery';
import StaticMarkdownRenderer from './StaticMarkdownRenderer.jsx'

export default class StaticPage extends React.Component {
    chapter() {
        return this.props.route.chapter;
    }

    shouldComponentUpdate(){
      return false;
    }
    render(){
        return(
          <div>
          <h1>{this.chapter().title}</h1>
            <StaticMarkdownRenderer chapter={this.chapter()} />
          </div>
        );
    }
}