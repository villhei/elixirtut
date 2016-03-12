import React from 'react';
import { findDOMNode } from 'react-dom'
import $ from 'jquery';
import hljs from 'highlight.js'

export default class StaticMarkdownRenderer extends React.Component {
    rawMarkup() {
        return{ __html: this.props.content};
    }

    componentDidMount() {
      const self = findDOMNode(this);
      $(self).find('pre > code').each(function (i, block) {
         hljs.highlightBlock(block);
      });
    }

    render(){
        return(
            <div className="article-page" dangerouslySetInnerHTML={this.rawMarkup()} />
        );
    }
}

StaticMarkdownRenderer.defaultProps = { content: '<h2>No content given for rendering</h2>' };