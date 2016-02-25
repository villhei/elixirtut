# Functional programming in Elixir


[lambda]: img/lambda.png

## About

Something about the material

## Functional programming

Short, motivating description of functional programming.

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
* Avoidance of side-effects
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

![Key concept][lambda]{:float:right} Paragraphs marked with the lambda symbol contain key functional programming concepts that apply also to many other languages than Elixir.


### Hello Elixir!

```elixir
IO.puts("Hello Elixir!")
```

Elixir scripts use the extension `.exs` by convention, and elixir source files user the extension `.ex`. Create a file `hello.exs` with the content above. Executing the `elixirc

```bash
$ elixir hello.exs 
Hello Elixir!
```

An Elixir script can be executed by using the command `elixir <filename.exs>` . Execute the file you created.

## Basic types

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

Two important functions for working with lists are the head `hd/1` and tail `tl/1` functions. 

The head `hd\1`function returns the first element of a non-empty list. `hd/1` raises an error for en empty list.

```elixir
iex> list = [1,2,3]
iex> tl(list)
[2,3]
iex> tl([1])
[]
```
The tail function returns all the elements but the first of a non-empty list. If the list only has a single element, `tl\1` returns an empty list. Like the head function, tail raises an error if the list is empty.
```elixir
iex> [head | tail] = [1,2,3]
[1,2,3]
iex> head
[1]
iex> tail
[2,3]
```

Elixir also features a shorthand syntax for matching the head and list of the tail with the operator `|`. The operator can also be used to prepend items to a list, as shown in the next example.

```elixir
iex> list = [1,2,3]
[1,2,3]
iex> [0 | list]
[0,1,2,3]
```

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

Use the `put_elem/3` function to modify an element of a tuple. Notice that all declared variables in Elixir are immutable, and the `put_elem/3` returns a new copy of the original tuple rather than modifying the original element like typically done in eg. Java.

Immutability is a key concept in functional languages. Immutability allows for easier reasoning about the code and efficient equality comparisons, where only references of the values need to be compared.

## Functions and modules

### Modules

Elixir uses the concept of modules for grouping several functions together. Functions, other than anonymous functions, cannot be declared outside the scope of a module. We introduce the modules here very briefly and return to them when we start building something more complex. 

```elixir
iex> defmodule Math do 
...>  def square(a) do
...>    a * a
...>  end
...>end

iex> Math.square(2)
4
```

A module can be declared using the `iex` interpreter, or by saving the contents of the module to a file with the `.ex` extension by convention. Modules declared in separate files should be compiled with the `elixirc` compiler

``` elixir
defmodule <module_name> do
  # Module body
end
```
The module definition follows the format `defmodule` module name `do` ... module body ... `end`. Functions within a module are defined with the `def` macro and private functions visible only within the lexical scope of the module use the `defp` macro. 
``` elixir
def function_name(param_a, param_b) do
  # Function body
end
```

Both public and private functions follow the structure `def` fn_name(params..) `do` ... function body ... `end`

```elixir
def square(a) do
  a * a
end
```

![Key concept][lambda]{:float:right} It is also worth noticing, that the function does not have an explicit `return` statement or similar, like imperative languages such as Java or C tend to use. This is a common feature in functional languages. The function body is an expression, and the last evluated value in the function body is treated as the function's return value, as in, the value the function evaluates to.

**math.ex**

```elixir
defmodule Math do
  def square(a) do
    a * a
  end
end
```

Create a new file called `math.ex` and save the contents above inside the file.

```bash
$ elixirc math.ex
```

When the module is defined in it's own file, the module can be compiled with the `elixirc` command followed by the filename. The bytecode resulting from the compilation of our example can be found from the file `Elixir.Math.beam` 

```elixir
iex> Math.square(2)
4
```

When executing the `iex` REPL in the same directory the compiled file is stored in, the module is automatically available for the Elixir interpreter. 

### Functions

![Key concept][lambda]{:float:right} Extensive use and composition of short, single purpose functions is one of the distinguishing properties of functional programming. Functions are first citizens in the functional programming, as in functions are acceptable parameters for functions, functions can be anonymous or named, assigned to variables, stored in data structures and functions can return functions as their return values.

In other words, function is a value with the type function, which when evaluated, reduces to the return value generated by the expressien captured by the function. 

```elixir
defmodule Temperature do
  def fahrenheit_to_celsius(t) do
    (t - 32) * 5/9
  end

  def celsius_to_fahrenheit(t) do
    t * 9/5 + 32
  end

  def celsius_to_kelvin(t) do
     273.15 + t
  end

  def kelvin_to_celsius(t) do
    t + 273.15
  end

  def kelvin_to_fahrenheit(t) do
    celsius_to_fahrenheit(kelvin_to_celsius(t))
  end

  def fahrenheit_to_kelvin(t) do
    celsius_to_kelvin(fahrenheit_to_celsius(t))
  end
end
```

The above is an example of the module `Temperature` which consists of conversion functions between temperatures reported in celsius, kelvin and fahrenheit. The functions do not have an explicit return statement, instead the functions return the value the expression representing the function body evaluates to. In this case, the expressions of the functions evaluate to the result of the calculation declared in the function body. 

```elixir
defmodule PersonOps do
  def print_age(p) do
    IO.puts("The person's age is #{p.age}")
  end

  def print_name(p) do 
    name = p.first_name <> " " <> p.last_name
    IO.puts("The person's age is #{name}")
  end
end
```

Let's declare some operations for a person represented by the map type. The person has three properties, `first_name`, `last_name` and `age`.

```elixir
iex> person = %{first_name: "Esko", last_name: "Erikoinen", age: 42}
%{age: 42, first_name: "Esko", last_name: "Erikoinen"}

iex> PersonOps.print_age(person)
The person's age is 42
:ok

iex> PersonOps.print_name(person)
The person's age is Esko Erikoinen
:ok
```
You'll notice that the functions perform the actions you expected. A careful reader makes an additional note: now that the `IO.puts\1` is the last value of the expression declared in the function body, in addition to the `:stdout` output the function returns the atom `:ok` indicating a succesful I/O operation.

Repeat after me: everything is an expression, and every expression evaluates to a value.

In Elixir everything is an expression, as in everything has an identifiable value.

### Recursion

### λ (lambda) functions 

### High-order functions

## Pattern matching

### Cond

### Pattern matching

### Pin operator

## Advanced techniques

### Currying

![Key concept][lambda]{:float:right} Currying is an often used technique in functional programming languages to translate functions with multiple parameters (arity of n where n > 1) into a sequence functions that accept a single parameter (arity of 1).

Currying is not built in to the Elixir core language, so we define a module for transforming functions.

```elixir
iex> people = [%{name: "Matti Ruohonen", born: 1949},
...> %{name: "Teppo Ruohonen", born: 1948}, 
...> %{name: "Seppo Räty", born: 1962}]
```

Let's define a list people represented by map objects.

```elixir
iex> names = people |> Enum.map(fn(map) -> Map.get(map, :name) end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
```

The names can be fetched from the map objects by calling `Map.get(map, key)` in an anonomyous function, but having to do this repeatedly can get a bit labory.

**mapops.ex**
```elixir
defmodule MapOps do
   def get_key(key) do
     fn(map) -> Map.get(map, key) end
   end
end
```
We start by defining the module `MapOps` which is used to contain our function `get_key/1` that takes the key we are interested in as it's own parameter. The `get_key/1` function returns an anonymous `fn/1` that takes a map of interest as it's parameter.

```elixir
iex> import MapOps
nil
iex> get_name = MapOps.get_key(:name)
#Function<0.89557173/1 in CurryTest.get/1>
iex> get_born = MapOps.get_key(:born)
#Function<0.89557173/1 in CurryTest.get/1>
```

When calling the `MapOps.get_key/1` the function returns the anonymous inner function, that is now ready to accept a parameter.

```elixir
names = people |> Enum.map(get_name)
ages = people |> Enum.map(get_born)
```

Now the benefit of the curried function is clearly visible, as we reduced the repeated code quite a plenty. The currying can be generalized even further, as shown [in this blog post](http://blog.patrikstorm.com/function-currying-in-elixir).

## Building applications

## Reactive applications

### Game of Life

Life.Board.t is a convention

defomdule Life.Board do
	@type t :: map
end