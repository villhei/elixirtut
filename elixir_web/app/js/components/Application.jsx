import React from 'react';
import Navigation from './Navigation.jsx';

export default class Application extends React.Component {

    render(){
        return(
          <div id="page-wrapper">
            <div id="sidebar-wrapper">
              <Navigation></Navigation>
            </div>
            <div id="page-content-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-9 col-centered content-container">
                    {this.props.children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}