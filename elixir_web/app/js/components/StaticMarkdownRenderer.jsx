import React from 'react';
import { findDOMNode } from 'react-dom'
import $ from 'jquery';
import hljs from 'highlight.js'

export default class StaticMarkdownRenderer extends React.Component {

    rawMarkup() {
        return{ __html: this.props.chapter.content};
    }

    handleHighlight() {
      const self = findDOMNode(this);
      $(self).find('pre > code').each(function (i, block) {
         hljs.highlightBlock(block);
      });
    }

    // This logic is risky, but problems haven't still popped up
    componentDidUpdate() {
      this.handleHighlight();
    }

    componentDidMount() {
      this.handleHighlight();
    }

    render(){
        return(
            <div className="article-page" dangerouslySetInnerHTML={this.rawMarkup()} />
        );
    }
}

StaticMarkdownRenderer.defaultProps = { content: '<h2>No content given for rendering</h2>' };