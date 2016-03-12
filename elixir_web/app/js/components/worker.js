import hljs from 'highlight.js'

onmessage = function(event) {
    var result = hljs.highlightAuto(event.data);
    postMessage(result.value);
}