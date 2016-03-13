[lambda]: img/lambda.png
[backus]: img/backus2.gif

## <a name="about_material"></a>About the material
<div class="warning">
<span>**This guide is a work in progress.**</span
<p>This aims to be a comperehensive guide to the funcional programming paradigm using the Elixir programming language as an example.</p>
</div>

This material is being prepared for a course in functional programming in the Computer Science department of Helsinki University.

The material is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.

## <a name="material_notes"></a>Notes for the reader

* When introducing functions, we use a notation `fun_name/1` where 1 indicates the number of parameters accepted by that function
* This material follows the conventions from [Elixir style guide](https://github.com/niftyn8/elixir_style_guide)

<div class="key-concept">
  ![Key concept][lambda]<span>These boxes!</span>
  <p>These boxes pop up here and the in the text. They are marked with the lambda symbol. These boxes contain key functional programming concepts that apply also to many other languages than Elixir.</p> 
</div>

***

## <a name="functional_programming"></a>Functional programming
![John Backus][backus]<div class="quote"><p>Conventional programming languages are growing ever more enormous, but not stronger. Inherent defects at the most basic level cause them to be both fat and weak: their primitive word-at-a-time style of programming inherited from their common ancestor -- the von
Neumann computer, their close coupling of semantics to state transitions, their division of programming into a world of expressions and a world of statements, their inability to effectively use powerful combining forms for
building new programs from existing ones, and their lack of useful mathematical properties for reasoning about programs. .</p>
    <span class="quotee">-John Backus, 1977, The creator of FORTRAN</span>
</div>

Functional programming is a [programming paradigm](https://en.wikipedia.org/wiki/Programming_paradigm) that treats computation as evulation of mathematical functions or expressions and avoids changing state and mutable data. Functional programming has it's roots on lambda calculus, a formal system developed in the 1930s to investiage computability.

Functionally written programs are executed by evaluating expressions, as opposed to the imperative approach of composing programs from both statements and expressions. In imperative programming languages, the program state is global and can be mutated or changed.

Functional programming avoids mutable state and all kinds of side-effects. Functions are first-class citizens, which means they can be treated like any value, passed around as arguments or returned as return values from expressions or functions. Functions can also be manipulated by other functions. 

Advances in multi-core and parallel processing have caused a surge of interest in functional languages. The approach of avoidance of side-effects and global, mutable states in functional programming suits this domain extremely well. Parallel processing in eg. Elixir is a very different kind problem when compared to imperative languages. One might argue that it is a hell of a lot easier and fun.

Functional programming is generally known to provide a lot better support for *structured programming* than imperative programming. A structured program is a program where the program is composed of structural abstractions and components. Functional languages allows the programmer to create these abstractions in an easy and clean manner. High-order fundtion abstracting loop-structures in Elixir are an excellent example of these elegant abstractions.

```elixir
defmodule Sort do
  def merge_sort(list) when length(list) <= 1, do: list
  def merge_sort(list) do
    {left, right} = Enum.split(list, div(length(list), 2))
    :lists.merge( merge_sort(left), merge_sort(right))
  end
end
```

By looking at the example above, it should be obvious that functional applications are often more declarative, clearner and typically a lot shorter than their imperative counterparts. Less code translates to less bugs, higher productivity and a better readability.

An increasing number of programming languages support functional programming features, but they rarely do so very well. In order to understand what the functional programming approach has to offer, one has to really learn a functional programming language and the way applications are built in this paradigm.

## <a name="elixir"></a>Elixir?

Elixir is a functional programming language for the Erlang virtual machine BEAM. Elixir is a functional and concurrent general purpose language deriving from Erlang. Elixir decorates Erlang's extremely powerful concurrency model with features such as macros and support metaprogramming. 

Elixir is a relatively new language. The first version of the language was released in 2012. Elixir is the brainchild of José Valim. José Valim is one of the the authors of the Rails project for the Ruby language, and syntactical influence from Ruby is obvious in Elixir.

Elixir was chosen for this guide instead of languages such as `haskell`, `clojure` or `scala` for it's clean syntax, ease of use and small, understandable language core and for it's powerful Erlang-adopted features for parallel processing. 

#### <a name="elixir_key_features"></a>Key features

* Compiles to bytecode for the Erlang VM
* Dynamic, strong typing
* Support for the Erlang actor model
* Erlang-Elixir interoperability
* Support for polymorphism via protocols

#### <a name="elixir_functional_features"></a>Functional features

* Everything is an expression
* Functions are first class citizens
* Lazy streams
* Pattern matching
* Emphasis on recursion and high-order functions
* Avoidance of side-effects
* Extensive use of high order functions
* Lambda (anonymous) functions

## <a name="elixir_installation"></a>Installation

**TODO** more text

* Using version 1.2.3
* [Installation instructions](http://elixir-lang.org/install.html)
* Sublime as an editor works reasonably well

## <a name="elixir_usage"></a>Usage

**TODO** more text

* Run with the interactive REPL `iex`
* As scripts with  `elixir`
* Compiler `elixirc`