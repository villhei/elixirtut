import React from 'react';
import { findDOMNode } from 'react-dom'
import $ from 'jquery';
import StaticMarkdownRenderer from './StaticMarkdownRenderer.jsx'

export default class StaticPage extends React.Component {
    content() {
        return this.props.route.content;
    }

    shouldComponentUpdate(){
      return false;
    }
    render(){
        return(
            <StaticMarkdownRenderer content={this.content()} />
        );
    }
}