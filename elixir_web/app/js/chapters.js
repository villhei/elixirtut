import introduction from '../chapters/introduction.md'
import basic_types from '../chapters/basic_types.md'
import data_structures from '../chapters/data_structures.md'
import processes from '../chapters/processes.md'
import process_abstractions from '../chapters/process_abstractions.md'
import language_tools from '../chapters/language_tools.md'
import drafts_and_ideas from '../chapters/drafts_and_ideas.md'
import conditionals from '../chapters/conditionals.md'
import functions_modules from '../chapters/functions_modules.md'
import high_order_fun from '../chapters/high_order_functions.md'
import pattern_matching from '../chapters/pattern_matching.md'
import lazy_streams from '../chapters/lazy_streams.md'
import file_io from '../chapters/file_io.md'


let raw_chapters = [{
        title: "Introduction (70% done)",
        path: "/introduction",
        content: introduction,
      },
      {
        title: "Basic types (95% done)",
        path: "/basic_types",
        content: basic_types
      },
      {
        title: "Data structures (80% done)",
        path: "/data_structures",
        content: data_structures
      },
      {
        title: "Conditional structures (95% done)",
        path: "/conditionals",
        content: conditionals
      },
      {
        title: "Functions and modules (90% done)",
        path: "/functions_modules",
        content: functions_modules
      },
      {
        title: "Pattern matching (70% done)",
        path: "/pattern_matching",
        content: pattern_matching
      },
      {
        title: "High-order functions (90% done)",
        path: "/high_order_fun",
        content: high_order_fun
      },
      {
        title: "Lazy evaluation and streams (80% done)",
        path: "/lazy_streams",
        content: lazy_streams
      },
      {
        title: "Hello outside world! Input and output (0% done)",
        path: "/file_io",
        content: file_io
      },
      {
        title: "Parallelism with processes (90% done)",
        path: "/processes",
        content: processes
      },
      {
        title: "Supervisors and process abstractions (5% done)",
        path: "/supervisors_abstractions",
        content: process_abstractions
      },
      {
        title: "Language tools (40% done)",
        path: "/language_tools",
        content: language_tools
      },
      {
        title: "Drafts and ideas",
        path: "/drafts",
        content: drafts_and_ideas
      }];

let numbered = raw_chapters.map(function(chapter, i) { 
  chapter.number = i+1;
  return chapter;
});

export function prevChapter(current) {
  if(current.number < 2) {
    return [];  
  } else {
    return [numbered[current.number-2]];
  }
}

export function nextChapter(current) {
  if(current.number == numbered.length) {
    return [];
  }
  return [numbered[current.number]];
}

export const chapters = numbered;
