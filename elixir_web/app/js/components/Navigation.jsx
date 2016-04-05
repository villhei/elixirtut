import React from 'react';
import {chapters} from '../chapters.js'
import { Link } from 'react-router'

export default class Navigation extends React.Component {

    render(){
      let links = chapters.map(chapter => 
             (<li key={chapter.path}><Link to={chapter.path}>{chapter.title}</Link></li>))
        return(
            <ul className="sidebar-nav">
                <li className="sidebar-brand">
                   <a href="#/">Funprog.ex</a>
                </li>
                <li>
                    <a href="#/">Contents</a>
                    <ol className="sidebar-subnav">
                      {links}
                    </ol>
                </li>
                <li>
                    <a href="#">Exercises</a>
                </li>
                <li>
                    <a href="#">About</a>
                </li>
                <li>
                    <a href="https://github.com/zzats/elixirtut">Code on Github</a>
                </li>
            </ul>);
    }
}