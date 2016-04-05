require('file?name=[name].[ext]!../index.html');

import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import Routes from './routes.jsx'

import hljs from 'highlight.js'


(function() {
  hljs.registerLanguage('language-elixir', function(hljs) {
    return hljs.getLanguage('elixir');
  });
  $(document).ready(function() {
      main();
  });
})()

function main() {

  render((<Routes/>
   ), document.getElementById('app-wrapper'));
}