import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router-dom'

import $ from 'jquery';
import StaticMarkdownRenderer from './StaticMarkdownRenderer.jsx'
import { prevChapter, nextChapter } from '../chapters.jsx'

function getButton(title, cssClass) {
  return (chapter) => {
    return (<div key={chapter.path} className={cssClass}>
      <Link to={chapter.path}>
        <span className="title">{title}</span>{chapter.title}
      </Link>
    </div>);
  }
}

export default class StaticPage extends React.Component {
  render() {
    const prevButton = prevChapter(this.props.chapter).map(getButton("Previous chapter", "prev-chapter"));
    const nextButton = nextChapter(this.props.chapter).map(getButton("Next chapter", "next-chapter"))
    return (
      <div>
        <h1>{this.props.chapter.title}</h1>
        <StaticMarkdownRenderer content={this.props.chapter.content} />
        <div className="page-controls">
          {prevButton}
          {nextButton}
        </div>
      </div>
    );
  }
}

StaticPage.propTypes = {
  chapter: PropTypes.object.isRequired
}