import React from 'react';
import { findDOMNode } from 'react-dom'
import $ from 'jquery';
import HLWorker from './worker.js'
import hljs from 'highlight.js'

export default class StaticMarkdownRenderer extends React.Component {
    rawMarkup() {
        return{ __html: this.props.content};
    }

    componentDidMount() {
      console.log('Component did mount')
      console.log(this);
      const self = findDOMNode(this);
        var worker = new Worker(HLWorker);
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