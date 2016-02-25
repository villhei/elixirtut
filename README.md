# Functional programming in Elixir

## About

Sometghing about the material

## Elixir

Elixir is a programming language for the Erlang virtual machine BEAM. Elixir is functional, concurrent general purpose language deriving from Erlang, with added features such as macros and metaprogramming. 

### Key features

* Compiles to bytecode for the Erlang VM
* Dynamic, strong typing
* Support for the Erlang actor model
* Erlang-Elixir interoperability

### Functional features

* Everything is an expression
* Functions are first class citizens
* Lazy streams
* Pattern matching
* Emphasis on recursion and high-order functions
* Avoidance side-effects
* Extensive use of high order functions
* Lambda (anonymous) functions

### Installation

* Using version 1.2.3
* [Installation instructions](http://elixir-lang.org/install.html)
* Sublime as an editor works reasonably well

### Usage

* Run with the interactive REPL `iex`
* As scripts with  `elixir`
* Compiler `elixirc`

### Notes

* When introducing functions, we use a notation `fun_name/1` where 1 indicates the number of parameters accepted by that function
* This material follows the conventions from [Elixir style guide](https://github.com/niftyn8/elixir_style_guide)


### Hello Elixir!

```elixir
IO.puts("Hello Elixir!")
```

Elixir scripts use the extension `.exs` by convention, and elixir source files user the extension `.ex`. Create a file `hello.exs` with the content above. 

```bash
$ elixir hello.exs 
Hello Elixir!
```

An Elixir script can be executed by using the command `elixir <filename.exs>` . Execute the file you created.

#### Basic types

Basic types and their typing formats.

```elixir
iex> 1          # integer
iex> 0b1010		# integer, binary -> 10
iex> 0o111		# integer, octal -> 73
iex> 0x1FF      # integer, hex -> 255
iex> 1.0        # float
iex> 1.23e+3	# float, exponent -> 1230.0
iex> true       # boolean
iex> :atom      # atom / symbol
iex> "elixir"   # string
iex> [1, 2, 3]  # list
iex> {1, 2, 3}  # tuple
```

* Floats are 64-bit double precision
* Elixir is a dynamically typed language so the types are inferred during runtime. 
* The [Kernel.TypeSpec](http://elixir-lang.org/docs/v1.1/elixir/Kernel.Typespec.html) module provides macros and functions for working with typespecs that allow static analyzer programs useful for bug hunting.
* In elixir, custom types composing of basic types can be defined by using the `@type` directive.

In addition to the basic types listed above, Elixir also provides additional types such as a `Port`,  `PID` and a `Reference`, more about these types later on.

### Basic arithmetic and numbers

Open up the `iex` REPL and try out the following expressions

```elixir
iex> 1 + 2
3
iex> 5 * 5
25
iex> 10 / 2
5.0
```

It's worth noticing that the division above returned a float `5.0` instead of an integer, if you want to do division and remainders with integers, you should use the functions `div/2` and `rem/2`

```elixir
iex> div(10, 2)
5
iex> div 10, 2
5
iex> rem 10, 3
1
```

In elixir, parentheses are optional in function invocation. Parentheses are preferred most of the time in these examples. 

```elixir
iex> round(3.55)
4
iex> trunc(3.55)
3
```

In case you want to convert integers to floats, you can use either the `round` function to round to the nearest, or `trunc` to get the integer part of the number.

### Booleans

```elixir
iex> true
true
iex> true == false
false
iex> is_boolean(true)
true
iex> is_boolean(1)
false
```

Elixir comes with several predicate functions for checking value types, here we used `is_boolean/1` to check if a given value is a boolean or not.

```elixir
iex> is_integer(1)
true
iex> is_float(2.0)
true
iex> is_number(0xFF)
true
iex> is_string("Hello!")
true
```

There exists a function (really a macro) for checking the type of every basic type in the [Kernel](http://elixir-lang.org/docs/v1.2/elixir/Kernel.html) module.

```elixir
iex> true and true
true
iex> true and false
false
iex> true or false
true
iex> false or true
true
iex> not true
false
```

Elixir uses the logical operators `and`, `or` and `not` for boolean values.

| Operator | Elixir | Java |
| -------- | ------ | ---- |
| And      |`and`   | `&& `|
| Or       |`or`    | `||` |
| not      |`not`   | `!`  |

```elixir
iex> 1 || true
1
iex> false || 2
2
iex> nil && 42
nil
iex> true && 42
42
iex> !true
false
iex> !1
false
iex> !nil
true
```

Elixir also provides the operators `&&`, `||` and `!`. The difference with the former operators is that they accept any kinds of values to be evaluated. These operators evaluate all values except `false` and `nil` to true.

You should use the operators `and`,  `or` and `not` always when you are excepting booleans.

```elixir
iex> 1 == 1
true
iex> 1 != 2
true
iex> 1 < 2
true
```

Elixir also provides the operators `==`, `!=`, `===`, `<=`, `>=`, `<` and `>` for comparisons.

```elixir
iex> 1 == 1.0
true
iex> 1 === 1.0

```

The difference between the `==` and  `===` comparisons is that the latter is a strict comparison when comparing integers and floats.

```elixir
iex> 1 < :atom
true
```

It is also possible to compare different types, which proves itself useful when implementing ie. sorting algorithms, the same algorithm works for different data types.

```
number < atom < reference < functions < port < pid < tuple < maps < list < bitstring
```

The ordering in comparisons of different data types is represented in the table above. 

### Atoms

```elixir
iex> :foo
:foo
iex> :bzzzt
:bzzzt
iex> :cat
:cat
```

Atoms or are constants, which's name is their value. Atoms are sometimes called symbols in other languages.

```elixir
iex> is_atom(:cat)
true
iex> is_atom(:foo)
true
iex> is_atom(true)
true
iex> is_boolean(:false)
true
```

It turns out, booleans are implemented as atoms.

### Strings

```elixir
iex> "Älämölö"
"Älämölö"
```

Strings are inserted between double quotes and encoded in UTF-8.


```elixir
iex> "Functional" <> " programming " <> "is fun"
"Functional programming is fun"
```

Strings can be concatenated with the `<>` operator.


```elixir
iex> "I like #{:moomins}"
"I like moomins"
```

Elixir also supports string interpolation. You can insert the value into a string by enclosing the var_name like `#{var_name}`. Remember atom name equals their value.

```elixir
iex> "Hey you, out there in the cold
---> getting lonely, getting old
---> can you feel me?"
"Hey you, out there in the cold\ngetting lonely getting old\ncan you feel me?"
```

Strings can span multiple lines, and they can use escape sequences such as `\n` for newline and `\t` for a tab.

### Lists

Lists play an important role in functional programming in general. The first functional language [LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)) (1958) is in fact an acronym for LISt Processor.

Lists in Elixir, as like with most other functional languages, are implemented internally as linked lists. It's good to keep this in mind, as it means prepending to a list runs in constant time `O(1)` and thus populating a list from left to right runs in linear time `O(N)`.

```elixir
iex> [1,2,3,4,5]
[1,2,3,4,5]
iex> length([1,2,3])
3
```

A list can be introduced by enclosing a set of comma separated values within brackets `[]`. You can get the length of a list by calling the function `length\1`. Remember, calculating the length of a linked list runs in linear `O(N)` time. 

```elixir
iex> [1,2,3] ++ [4,5,6]
[1,2,3,4,5,6]
iex> [1,2,3,4,5,6] -- [2, 4]
[1,3,5,6]
```

Two lists can be concatenated with the unary function `++/2` and subtracted with `--/2`.

```elixir
iex> list = [1,2,3]
iex> hd(list)
1
iex> hd([])
** (ArgumentError) argument error
	:erlang.hd([])
```

Two important functions for working with lists are the head `hd\1` and tail `tl\1` functions. 

The head `hd\1`function returns the first element of a non-empty list. `hd\1` raises an error for en empty list.

```elixir
iex> list = [1,2,3]
iex> tl(list)
[2,3]
iex>tl([1])
[]
```
The tail function returns all the elements but the first of a non-empty list. If the list only has a single element, `tl\1` returns an empty list. Like the head function, tail raises an error if the list is empty.

### Tuples

Functional programmers often find the need to return more than a single value from a function. These sets of values can be represented as tuples, which are ordered pairs of n elements. 

```elixir
iex> cat = {:cat, 'Brown', 5}
{:cat, 'Brown', 5}
iex> tuple_size(cat)
3
```

Tuples are defined by using curly brackets. The elements in a tuple are stored contiguously in memory, which means that accessing the elements of a tuple by index, or getting the size of a tuple is a fast operation. Tuples are indexed from zero.

```elixir
iex> cat = {:cat, 'Brown', 5}
iex> put_elem cat, 1, "Pink"
{:cat, "Pink", 5}
iex> cat
{:cat, 'Brown', 5}
```

Use the `put_elem\3` function to modify an element of a tuple. Notice that all declared variables in Elixir are immutable, and the `put_elem\3` returns a new copy of the original tuple rather than modifying the original element like typically done in eg. Java.

Immutability is a key concept in functional languages. Immutability allows for easier reasoning about the code and efficient equality comparisons, where only references of the values need to be compared.

### Game of Life

Life.Board.t is a convention

defomdule Life.Board do
	@type t :: map
end