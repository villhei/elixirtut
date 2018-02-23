import React from 'react';
import { findDOMNode } from 'react-dom'
import hljs from 'highlight.js'

export default class StaticMarkdownRenderer extends React.Component {
    rawMarkup() {
        return{ __html: this.props.content};
    }

    handleHighlight() {
      const self = findDOMNode(this)
      const codeBlocks = Array.from(self.querySelectorAll('pre > code'))
      codeBlocks.forEach(function (block) {
         hljs.highlightBlock(block)
      });
    }

    // This logic is risky, but problems haven't still popped up
    componentDidUpdate() {
      this.handleHighlight()
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