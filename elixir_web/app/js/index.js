import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import Main from './Main.jsx'

import hljs from 'highlight.js'


(() => {
  hljs.registerLanguage('language-elixir', (hljs) => {
    return hljs.getLanguage('elixir')
  })
  $(document).ready(function() {
      main()
  })
})()

function main() {
  render((<Main/>
   ), document.getElementById('app-wrapper'))
}