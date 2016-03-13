import React from 'react';
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router'

import $ from 'jquery';
import StaticMarkdownRenderer from './StaticMarkdownRenderer.jsx'
import {prevChapter, nextChapter} from '../chapters.js'

export default class StaticPage extends React.Component {
    chapter() {
        return this.props.route.chapter;
    }

    shouldComponentUpdate(){
      return false;
    }
    render(){

      function getButton(title, cssClass) {
        return function(chapter) {
          return (<div key={chapter.path} className={cssClass}><Link to={chapter.path}><span>{title}</span>{chapter.title}</Link></div>);
        }
      }
      let prev = prevChapter(this.chapter()).map(getButton("Previous chapter", "prev-chapter"));
      let next = nextChapter(this.chapter()).map(getButton("Next chapter", "next-chapter"));

        return(
          <div>
          <h1>{this.chapter().title}</h1>
            <StaticMarkdownRenderer chapter={this.chapter()} />
            <div className="page-controls">
            {prev} {next}
            </div>
          </div>
        );
    }
}