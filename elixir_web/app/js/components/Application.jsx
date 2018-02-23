import React from 'react'
import { Route } from 'react-router-dom'
import Navigation from './Navigation.jsx'
import Page from './Page.jsx'
import Contents from './Contents.jsx'
import { chapters } from '../chapters.jsx'

const chapterRoutes = chapters.map(chapter => {
  const component = <Page chapter={chapter} />
  return (<Route path={chapter.path} key={chapter.path} render={() => (
    <Page chapter={chapter} />
  )}
  />)
})

export default class Application extends React.Component {

  render() {
    return (
      <div id="page-wrapper">
        <div id="sidebar-wrapper">
          <Navigation></Navigation>
        </div>
        <div id="page-content-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-9 col-centered content-container">
                <Route exact path="/" component={Contents} />
                {chapterRoutes}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}