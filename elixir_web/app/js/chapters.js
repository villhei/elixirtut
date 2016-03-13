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

let raw_chapters = [{
        title: "Introduction",
        path: "/introduction",
        content: introduction,
      },
      {
        title: "Basic types",
        path: "/basic_types",
        content: basic_types
      },
      {
        title: "Data structures",
        path: "/data_structures",
        content: data_structures
      },
      {
        title: "Conditional structures",
        path: "/conditionals",
        content: conditionals
      },
      {
        title: "Functions and modules",
        path: "/functions_modules",
        content: functions_modules
      },
      {
        title: "High-order functions",
        path: "/high_order_fun",
        content: high_order_fun
      },
      {
        title: "Parallelism with processes",
        path: "/processes",
        content: processes
      },
      {
        title: "Supervisors and process abstractions",
        path: "/supervisors_abstractions",
        content: process_abstractions
      },
      {
        title: "Language tools",
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
