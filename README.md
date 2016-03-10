# Functional programming in Elixir

[lambda]: img/lambda.png

## Contents

- About the material
- Functional programming
- Elixir?
- Notes
- Hello Elixir!
- Basic types
- Functions and modules
- The pipe operator
- Pattern matching
- Conditions
- Processes
- Actors
- Advanced techniques
- Building applications
- Reactive applications

## <a name="about_material"></a>About the material

Something about the material

## <a name="functional_programming"></a>Functional programming

Short, motivating description of functional programming.

## <a name="elixir"></a>Elixir?

Elixir is a programming language for the Erlang virtual machine BEAM. Elixir is a functional and concurrent general purpose language deriving from Erlang. Elixir decorates Erlang's extremely powerful concurrency model with features such as macros and support metaprogramming. 

### <a name="elixir_key_features"></a>Key features

* Compiles to bytecode for the Erlang VM
* Dynamic, strong typing
* Support for the Erlang actor model
* Erlang-Elixir interoperability

### <a name="elixir_functional_features"></a>Functional features

* Everything is an expression
* Functions are first class citizens
* Lazy streams
* Pattern matching
* Emphasis on recursion and high-order functions
* Avoidance of side-effects
* Extensive use of high order functions
* Lambda (anonymous) functions

### <a name="elixir_installation"></a>Installation

* Using version 1.2.3
* [Installation instructions](http://elixir-lang.org/install.html)
* Sublime as an editor works reasonably well

### <a name="elixir_usage"></a>Usage

* Run with the interactive REPL `iex`
* As scripts with  `elixir`
* Compiler `elixirc`

## <a name="material_notes"></a>Notes for the reader

* When introducing functions, we use a notation `fun_name/1` where 1 indicates the number of parameters accepted by that function
* This material follows the conventions from [Elixir style guide](https://github.com/niftyn8/elixir_style_guide)

<div class="key_concept">
  ![Key concept][lambda] Paragraphs marked with the lambda symbol contain key functional programming concepts that apply also to many other languages than Elixir. 
</div>

## <a name="hello_elixir"></a>Hello Elixir!

```elixir
IO.puts("Hello Elixir!")
```

Elixir scripts use the extension `.exs` by convention, and elixir source files user the extension `.ex`. Create a file `hello.exs` with the content above. Executing the `elixirc

```bash
$ elixir hello.exs 
Hello Elixir!
```

An Elixir script can be executed by using the command `elixir <filename.exs>` . Execute the file you created.

## <a name="basic_types"></a>Basic types

Basic types and their typing formats.

```elixir
iex> 1          # integer
iex> 0b1010		# integer, binary -> 10
iex> 0o111		# integer, octal -> 73
iex> 0x1FF      # integer, hex -> 511
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
* In Elixir, custom types composing of basic types can be defined by using the `@type` directive.

In addition to the basic types listed above, Elixir also provides additional types such as a `Port`,  `PID` and a `Reference`, more about these types later on.

### A few words on immutability

Like most functional languages, Elixir favors immutable data. Immutability means, that a value cannot, and there is no way to change once a it has been declared. Immutability has lots of benefits to it, especially when it comes to parallel processing. Usually the challenges of parallel and asynchronous computation lies in the mutation of the state. All the writes by different parallel units of processing must carefully lock the data they write to and simultanous access to writable data structures is in practice very error prone. 

Immutable data completely avoids many shortcomings of using mutable values. Then again immutability is not a silver bullet nor without downsides. Immutability can be very costly, when there is an actual need to update a value, since every time we want to chang data, the previous value needs to be copied to the new value - which can be expensive for complex data structures.

Without a way to mutate values, the internal application state becomes an interesting topic. There are several constructs which allow to upkeep of an application state, such as state machines and actors. 

**TODO** Expand the immutability text with some pictorial examples and explain the variable reassignment

### <a name="basic_arithmetic"></a>Basic arithmetic and numbers

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

In Elixir, parentheses are optional in function invocation. Parentheses are preferred most of the time in these examples. 

```elixir
iex> round(3.55)
4
iex> trunc(3.55)
3
```

In case you want to convert integers to floats, you can use either the `round` function to round to the nearest, or `trunc` to get the integer part of the number.

### <a name="basic_types_booleans"></a>Booleans

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

### <a name="basic_types_atoms"></a>Atoms

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

### <a name="basic_types_strings"></a>Strings

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

## <a name="exercises_week0">Warmup exercises</a>

<div class="exercise_container">
    The exercises for this set can be previewed in exercise_drafts/week0.ex
</div>

### <a name="data_structures"></a> Data structures

#### <a name="data_structures_list"></a> Lists

Lists play an important role in functional programming in general. The first functional language [LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)) (1958) is in fact an acronym for LISt Processor.

Lists in Elixir, as like with most other functional languages, are implemented internally as linked lists. It's good to keep this in mind, as it means prepending to a list runs in constant time `O(1)` and thus populating a list from left to right runs in linear time `O(N)`.

```elixir
iex> [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> length([1,2,3])
3
```

A list can be introduced by enclosing a set of comma separated values within brackets `[]`. You can get the length of a list by calling the function `length\1`. Remember, calculating the length of a linked list runs in linear `O(N)` time. 

```elixir
iex> [1,2,3] ++ [4,5,6]
[1, 2, 3, 4, 5, 6]
iex> [1,2,3,4,5,6] -- [2, 4]
[1, 3, 5, 6]
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
[1, 2, 3]
iex> head
[1]
iex> tail
[2, 3]
```

Elixir also features a shorthand syntax for matching the head and list of the tail with the operator `|`. The operator can also be used to prepend items to a list, as shown in the next example.

```elixir
iex> list = [1,2,3]
[1, 2, 3]
iex> [0 | list]
[0, 1, 2, 3]
```

#### <a name="data_structures_streams_and_ranges"></a> Streams and ranges


#### <a name="data_structures_tuples"></a> Tuples

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

####  <a name="data_structures_maps"></a> Maps

```elixir
iex> country_capitals = %{:sweden =>  "Stockholm", 
...> :finland => "Helsinki", 
...> :germany => "Berlin", 
...> :spain => "Madrid"}
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
```

Map is a data structure used as a container for pairs with a key and a value. Maps are often used as a sort of dictionary, and it's an efficient way of indexing values for different types of searches and retriavals.

```elixir
iex> Map.get(country_capitals, :sweden)
"Stockholm"
```

The values contained in a map can be retrieved by calling `Map.get/2` function, which accepts a map and a key as it's parameters and retrieves the value associated with that key in constant `O(1)` time.

```elixir
iex> Map.put(country_capitals, :netherlands, "Amsterdam")
%{finland: "Helsinki", germany: "Berlin", netherlands: "Amsterdam",
  spain: "Madrid", sweden: "Stockholm"}
iex> country_capitals
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}

```

The `Map.put/3` function can be used to create an updated copy of a map provided as the first argument. The second argument is the new key to be inserted, and the third is the value associated with that key. The original map is on updated by the `Map.put/3` function.

```elixir
iex> Map.delete(country_capitals, :germany)               
%{finland: "Helsinki", spain: "Madrid", sweden: "Stockholm"}
iex> Map.drop(country_capitals, [:spain, :sweden])  
%{finland: "Helsinki", germany: "Berlin"}
```

The contents of the map can also be modified with the functions `Map.delete/2` which accepts a map and key to be deleted and `Map.drop/2` accepting a map and a list of keys to be deleted. The original map is not modified, but a new copy with the values removed is created.

## <a name="functions_and_modules"></a> Functions and modules

### <a name="modules"></a> Modules

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

<div class="key_concept">
##### <a name="implicit_return_values"></a> Implicit return values
![Key concept][lambda] It is also worth noticing, that the function does not have an explicit `return` statement or similar, like imperative languages such as Java or C tend to use. This is a common feature in functional languages. The function body is an expression, and the last evaluated value in the function body is treated as the function's return value.
</div>

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

### <a name="functions"></a> Functions

<div class="key_concept">
##### <a name="first_class_citizens"></a> Functions as first-class citizens
 ![Key concept][lambda] Extensive use and composition of short, single purpose functions is one of the distinguishing properties of functional programming. Functions are first class citizens in functional programming: functions are acceptable parameters for functions, functions can be anonymous or named, assigned to variables, stored in data structures and functions can return functions as their return values.

In other words, function is a value with the type function, which when evaluated, reduces to the return value generated by the expression captured by the function. 
</div>

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
    IO.puts("The person's name is #{name}")
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

### <a name="recursion"></a> Recursion

<div class="key_concept">
#### <a name="recursion_is_looping"></a> Recursion is looping
![Key concept][lambda] Recursion plays an important part in functional programming. Recursion is equivalent to looping, so expect to see no `for` or `while` loops when looking at functionally written code, but expect to see lots and lots of recursion.

Recursive function is a function that calculates it's final value by repeated application of the function - in other words - function calling itself over and over again.

Recursion and thinking recursively might feel a little strange for those used to the imperative programming paradigm. Recursion is no different from using while loops.
</div>

```java
int[] array = {1,2,3,4,5};

static int[] squareArray(int[] array) {  
  int[] result = new int[array.length];

  for(int i = 0 ; i < ; array.length ; ++i) {
    int[] result = new int[array.length];
    result[i] = array[i] * array[i];
  }

  return result;
}

int[] result = squareArray(array); // Yields an array of {1, 4, 9, 16, 25};

```

The Java code above represents a simple algorithm filling a result array with the squared values of the input array. Let's make a recursive rewrite of the function in Elixir.

```elixir
defmodule ArrayOps do
  def square_list([]) do
    []
  end
  def square_list([head|tail]) do
    [head*head | square_list(tail)]
  end
end

iex> ArrayOps.square_list [1,2,3,4,5]
[1, 4, 9, 16, 25]
```

Here we already play with a new concept called pattern matching, which we will discuss in more detail in a later chapter.

We defined a module `ArrayOps` with a two variants of the function `square_list/1`. The first variant accepts a pattern of empty list, the second variant accepts a pattern for a non-empty list (remember, the function `hd\1` raises an exception for an empty list). The second function multiplies the head of the list with itself, and prepends the result to the result produced by a recursive call to the same function `square_list/1`. The recursive call can now match against either of the functions by the same name.

The pattern matching is also used in the function parameters as `[head|tail]` to extract the head element from the tail of the list, as introduced in the lists-chapter earlier.

<div class="key_concept">
#### <a name="tail_call_optimization"></a> Tail call optimization
![Key concept][lambda] The function we defined does not come without problems. The Elixir compiler supports a feature called *tail call optimization* (or tail call elimination) for recursive functions. Tail call optimization refers to the elimination of the actual recursive call in favor of transforming the recursive calls in to a loop.

The optimization is a significant performance improvement over recursion. After the transformation the virtual machine does not need to allocate a new call stack to the successive recursive function calls, but can instead reuse the original stack created during the initial function call.

The condition for the tail call optimization to be applied is to formulate the recursive call so that the final, recursion-terminating call does not need any values from the previous function calls.
</div>

```elixir
defmodule ArrayOps do
  def square_list(list) do
    do_squaring([], list)
  end

  defp do_squaring(acc, []) do 
    acc
  end

  defp do_squaring(acc, [head|tail]) do
    do_squaring([head*head | acc], tail)
end

iex> ArrayOps.square_list [1,2,3,4,5]
[1, 4, 9, 16, 25]
```

The rewritten `square_list\1` uses a helper function to enable the elimination of the call stack creation. Creating a private helper function `do_squaring/2` within the module allows for the original call syntax for the users' of the function.

`do_squaring/2` takes two parameters, an accumulator list that holds the squared values and the list with the values to square. The function iterates over the list element-by-element, and finally when the list runs out of elements, the `do_squaring/2` returns the accumulated value.

## <a name="exercises_week0">Week 1 exercises</a>

<div class="exercise_container">
    The exercises for this set can be previewed in exercise_drafts/week1.ex
</div>

#### Functions as function parameters

**TODO** Write a block about the use of functions as parametrs

### <a name="lambda_functions"></a> λ (lambda) functions 

<div class="key_concept">
![Key concept][lambda] The functional programming paradigm has its roots in lambda calculus. Functional language implementations support declaring lambda functions, often with a very efficient syntax. Lambda functions are also called anonymous functions, as they do not have a name associated with them most of the time.

The common use case for lambda functions is as parameters to functions accepting functions. Lambda functions are often treated as throwaway functions to complement the functionality of high order functions, which we will discuss in the next chapter.
</div>

```elixir
iex> mult = fn(a,b) -> a * b end
#Function<12.54118792/2 in :erl_eval.expr/5>
iex> is_function(mult)
true
iex> mult.(3, 5)
15
```

On the first line we match an anonymous function accepting two parameters to a variable. The function just performs a multiplication for the arguments. 

The function is called by applying a the parameters `(3,5)` to the variable associated with the function. Notice that the arguments are separated by a dot `.` -  which is a requirement for calling anonymous functions.

Unlike regular functions, anonymous functions can be declared outside a module.

```elixir
iex> foo = "bar"
"bar"
iex> (fn -> foo = "quux" end).()
"quux"
iex>
"bar"
```

Lambda functions are closures, and such they have a private scope that only the anonymous function can access. Any variable declared within the scope of an anonymous function does not affect the higher leven environment.

Like any other function or expression, the lambda function evaluates to the value returned by that expression.

<div class="key_concept">
### <a name="high_order_functions"></a> High-order functions
![Key concept][lambda] High order functions are functions that accept functions as their arguments or return a function as their result. 

Elixir's [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module provides a familiar set of high-order functions often found in other functional languages. 

!! TODO mention Stream module here
</div>

The often used high-order functions we are about to look into are `map/2`, `filter/2`, `zip/2` and `fold/2`.

The high-order functions here are supplied by the [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module, and equivalent lazy functions can be found from the [Stream](http://elixir-lang.org/docs/stable/elixir/Stream.html) module. When working with collections, you can think of these functions as generalizations or replacements of loop constructs.

#### <a name="high_order_map"></a> Map/2

```elixir
iex> list = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> Enum.map(list, fn(x) -> x*x end)
[1, 4, 9, 16, 25]
```

The `map/2` is a function that accepts a variable of a type implementing the [Enumerable](http://elixir-lang.org/docs/stable/elixir/Enumerable.html) protocol (ie. a list, a map or a stream) as it's first parameter and a function accepting an element of the type.

`map/2` iterates over the `Enumerable` collection and executes the function for each of the elements within the collection, creating a new transformed instance of the collection as a result. Notice that operations performed within the `map/2` operation do not affect the original collection, but create a new transformed collection.

More formally, `map/2` is a function used to *map* (transform) an Enumerable of type A to type B.

```elixir
people = [%{name: "Matti Ruohonen", born: 1949},
          %{name: "Teppo Ruohonen", born: 1948}, 
          %{name: "Seppo Räty", born: 1962}]
```
Let's create a list objects representing the most important finnish celebrities and their birth years.

```elixir
iex> Enum.map(people, fn(p) -> Map.get(p, :name) end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
iex> Enum.map(people, fn(p) -> Map.get(p, :born) end)
[1949, 1948, 1962]

```
In the first case, the `map/2` transforms a list of `Map`s to a list of strings, without mutating the original collection. In the second case, `map/2` transforms the list of `Map`s to a list of strings. 

```elixir
iex> names = Enum.map(people, fn(p) -> Map.get(p, :name) end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
iex> Enum.map(names, fn(n) -> String.upcase(n) end)  
["MATTI RUOHONEN", "TEPPO RUOHONEN", "SEPPO RÄTY"]
```

`map/2` is often used to formulate *functional pipelines* where the value is transformed multiple times to a new format or type suitable for the next operation. The second call to `map/2` uses the function `upcase/1` from the [String](http://elixir-lang.org/docs/stable/elixir/String.html) module.

#### <a name="high_order_filter"></a> Filter/2

```elixir
iex> list = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> Enum.filter(list, fn(x) -> rem(x, 2) === 0 end)
[2, 4]
```

The `filter/2` is a function that accepts an `Enumerable` and a predicate function. `filter/2` executes the predicate function for each element in the `Enumerable`, and finally returns an `Enumerable` with those elements the predicate yielded `true` for. In the example above, `filter/2` is used to filter odd values out of the resulting collection.

The elements returned by the filter function are of the same type as the input elements, in other words, filter is used to limit the size of a sample when working with `Enumerable` types.

```elixir
iex> names = Enum.map(people, fn(p) -> Map.get(p, :name) end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
iex> Enum.filter(names, fn(n) -> String.contains?(n, "Ruohonen") end)
["Matti Ruohonen", "Teppo Ruohonen"]
iex> Enum.map(matches, fn(n) ->       
...>   name_parts = String.split(n, " ")
...>   hd(name_parts)
...> end)
["Matti", "Teppo"]
```

The `filter/2` function is often used together with other high order functions, like with the `map/2` used in this example. First the list of people is transformed to list of names. We are only interested in the names that include the string "Ruohonen", which we check for with the `String.contains?/2` function from the [String](http://elixir-lang.org/docs/stable/elixir/String.html) module. For the filtered list, we perform yet another `map/2` to split the names in to parts, of which we grab the first elements of.

#### <a name="high_order_zip"></a> Zip/2

```elixir
iex> numbers = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> alphabet = ["a", "b", "c", "d", "e"]
["a", "b", "c", "d", "e"]
iex> Enum.zip(numbers, alphabet)
[{1, "a"}, {2, "b"}, {3, "c"}, {4, "d"}, {5, "e"}]
iex> Enum.zip(numbers, numbers) 
[{1, 1}, {2, 2}, {3, 3}, {4, 4}, {5, 5}]
```

The `zip/2` is a function that takes two lists as parameters and merges their contents to a new list containing the values *zipped* together as tuples. 

```elixir
iex> Enum.zip(["Matti", "Teppo", "Seppo"], ["Ruohonen", "Ruohonen", "Räty"])
[{"Matti", "Ruohonen"}, {"Teppo", "Ruohonen"}, {"Seppo", "Räty"}]
iex> list = [1,2,3,4,5,6]
[1, 2, 3, 4, 5, 6]
iex> Enum.zip(list, tl(list))
[{1, 2}, {2, 3}, {3, 4}, {4, 5}, {5, 6}]

```

**TODO** better examples, maybe with streams?

Generally speaking, the purpose of the `zip/2` function is simply what we stated, but the use cases are endless. You sometimes might require the index of the element while performing a `map/2`, the solution is to call `zip/2` on the original list with a second list containing the indices.

#### <a name="high_order_reduce"></a> Reduce/2

```elixir
iex> numbers = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> Enum.reduce(numbers, 0, fn(n, acc) -> acc + n end)
15
```

The `reduce/3` function is used to reduce the values of an `Enumerable` to a single value. `reduce/3` accepts three paremeters, a collection, an initial value and a function. The parameter function has two params `(n, acc)` of which the `acc` is the initial accumulator value or the value returned by the previous iteration of the function and `n` is the value of the current element. The previous example simply sums the elements of the list.

```elixir
iex> names = ["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
iex> Enum.reduce(names, "", fn(name, acc) -> acc <> name <> "!!!11 "end)            
"Matti Ruohonen!!!11 Teppo Ruohonen!!!11 Seppo Räty!!!11 "
```

Like the other functions introduced, the `reduce/3` can work with any data type, and reduce the data to any kind of value.

## <a name="pipe_operator"></a> The pipe operator

We noticed that when applying several high-order functions sequentially, the code starts to lose some of it's beautiful, minimalistic elegance. Luckily we have the pipe operator `|>` that is used to chain pass the value on the left-hand side of the operator to the function on the right-hand side.

```elixir
iex> sum_of_squares = [1,2,3,4,5] 
...> |> Enum.map(fn(x) -> x*x end)
...> |> Enum.reduce(0, fn(n, acc) -> n + acc end)
55
```

In the example above, the pipe `|>` passes the array of numbers to the `map/2` function. The `map/2` passes the resulting array of squared values to the `reduce/3` function that calculates the sum of squares.

```elixir
people = [%{name: "Matti Ruohonen", born: 1949},
          %{name: "Teppo Ruohonen", born: 1948}, 
          %{name: "Seppo Räty", born: 1962}]
```

Let's return to the previous example of people and do some function chaining.

```elixir
iex> people 
...> |> Enum.map(fn(p) -> Map.get(p, :name) end)
...> |> Enum.filter(fn(n) -> String.contains?(n, "Ruohonen") end) 
...> |> Enum.map(fn(n) -> String.split(n, " ") end)
...> |> Enum.map(fn(nn) -> hd(nn) end)
...> |> Enum.reduce("", fn(n, acc) -> acc <> n <> " OMG!!! " end)
"Matti OMG!!! Teppo OMG!!! "
````

We can start seeing the benefits of the pipe operator here `|>`. The first step is to extract the names from the persons in people using `map/2`, then we use `filter/2` to check if the name contains the string `"Ruohonen"`, after which we split it to two parts with the `String.split/2`, drop the tail using `hd/1` on the split values and finally use `reduce/3` to reduce the result to a string.

Piping is by no means limited to the functions from the `Enum` module and you can use it any time you need to pass the result of the previous function as the first argument to the next function.

<div class="key_concept">
## <a name="pattern_matching"></a> Pattern matching

![Key concept][lambda] Pattern matching in functional languages is a mechanism often used for implementing control flows and guard expressions within functions and expressions. We have seen the operator '=' used earlier for assignment of variables. In reality, the `=` operator in Elixir is called the *match operator*.

As like pattern matching in other functional languages in general, pattern matching is used to match simple values to a format pattern, pattern matching can also be used to destructure complex data types.
</div>

```elixir
iex> hello = "Perfect match!"
"Perfect match!"
```

The example above matches the right-hand side of the match operator `=` to the left-hand side variable hello, which as en expression, evaluates to the value "Perfect match!" and assigns the value to the variable hello.

```elixir
iex> {a, b, c} = {"Mickey", "Donald", "Zappa"}
{"Mickey", "Donald", "Zappa"}
iex> a
"Mickey"
iex> b
"Donald"
iex> c
"Zappa"
```

Descructing using the match operator `=` works by comparing the right-hand side data structure (a tuple in this case) to the pattern `{a, b ,c}` on the left-hand side. Because the pattern matches, the variables a, b, c are assigned the values obtained from the destructured data structure.

```elixir
iex> {"Mickey", b, c} = {"Mickey", "Donald", "Zappa"}
{"Mickey", "Donald", "Zappa"}
iex> b
"Donald"
iex> c
"Zappa"
iex> {"Mike", b, c} = {"Mickey", "Donald", "Zappa"}  
** (MatchError) no match of right hand side value: {"Mickey", "Donald", "Zappa"}
```

The patttern can also be more specific, than just multiple variables. The matching can be constrained to require specific values to be present in the match pattern, or the match will result in a `MatchError`, which usually does not need to be handled in match chains, which we will be looking in to the next chapter.

```elixir
iex> [a, b, c] = [1, 2, 3]
[1, 2, 3]
iex> a
1
iex> b
2
iex> c
3

```

Matching and destructuring works also for other data types than tuples. A list can effectively be destructured in order to extract values. This is a nice shorthand syntax for accessing the values of the list data structure.

```elixir
iex> [a | b] = [1, 2, 3]
[1, 2, 3]
iex> a
1
iex> b
[2, 3]
```

It is also possible to extract the head and tail of the list using the match operator `=` in combination with the `[head | tail]` format, which we already looked in to in the [lists](#data_structures_list) chapter.

```elixir
iex> [a | b] = []
** (MatchError) no match of right hand side value: []

iex> [a | [] ] = [1]
[1]
iex> a
1
iex> [a| [] ] = [1,2,3]
** (MatchError) no match of right hand side value: [1, 2, 3]

iex> [1 | b] = [1, 2, 3]
[1, 2, 3]
iex> b
[2, 3]

```

It's worth noticing, that pattern matching can effectively be used to extract information of more information than just the values of the list. It's a very convenient way to find out i the list is empty or contains a single element, or the head of the list matches a specific value.

```elixir
iex> [1 | [2, b] ] = [1, 2, 3]
[1, 2, 3]
iex> b
3
```

Nested lists are also valid patterns to match against. The pattern above inspects the two leading values of the list and gives you access to the rest with the variable `b`.

### <a name="pin_operator"></a> Pin operator

## <a name="conditions"></a> Conditions

## <a name="processes"></a> Processes

## <a name="actors"></a> Actors

### <a name="actors_supervisors"></a> Supervisors

## <a name="advanced_techniques"></a> Advanced techniques

<div class="key_concept">
### <a name="advanced_techniques_currying"></a> Currying
![Key concept][lambda] Currying is an often used technique in functional programming languages to translate functions with multiple parameters (arity of n where n > 1) into a sequence  of functions that accept a single parameter (arity of 1).

Currying is not built in to the Elixir core language, so we define a module for transforming functions.
</div>

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
#Function<0.89557173/1 in MapOps.get/1>
iex> get_born = MapOps.get_key(:born)
#Function<0.89557173/1 in MapOps.get/1>
```

When calling the `MapOps.get_key/1` the function returns the anonymous inner function, that is now ready to accept a parameter.

```elixir
names = people |> Enum.map(get_name)
ages = people |> Enum.map(get_born)
```

Now the benefit of the curried function is clearly visible, as we reduced the repeated code quite a plenty. The currying can be generalized even further, as shown [in this blog post](http://blog.patrikstorm.com/function-currying-in-elixir).

## <a name="building_applications"> Building applications

Elixir uses the `mix` application to build and manage projects. In this chapter we wiill familiarize ourselves with the use of `mix`.

```bash
$ mix new example_project --module ExampleProject
```

We create a project `example_project` by calling `mix new`. The `--module` parameter specifies which module to use as an entry point in the application. The module name defaults to the project name, but we choose to use a CamelCased variant for it.

```bash
* creating README.md
* creating .gitignore
* creating mix.exs
* creating config
* creating config/config.exs
* creating lib
* creating lib/example.ex
* creating test
* creating test/test_helper.exs
* creating test/example_test.exs

Your Mix project was created successfully.
You can use "mix" to compile it, test it, and more:

    cd example
    mix test

Run "mix help" for more commands.

```
Mix will now create the project structure and some helper files you typically would need to create anyway. 

##### mix.exs 
The file `mix.exs` is reponsible for managing your project's dependencies, version information and it's execution environment and top-level configuration.

##### config 
The folder is used to store the project's configuration file `config.exs`, in which you manage configuration of your application and it's dependencies. The configration contains key-value pairs.

```elixir
config :example, example_config_key: :configuration_value
```

The config can be accessed with the `Application._get.env/2` function during runtime. 

##### lib
This folder is used to store the application source code. Mix automatically creates a placeholder file used with the module `Example` defined. The files in the `lib` folder are targets of compilation, and use the `.ex` extension by convention.

##### test
Elixir applications use the [ExUnit](http://elixir-lang.org/docs/stable/ex_unit/ExUnit.html) test framework for unit tests. An example of test is also provided. Notice that the tests use `.exs` for their extension, as the tests do not need to be compiled in order to be useful.

```bash
$ mix compile
Compiled lib/example.ex
Generated example app
Consolidated List.Chars
Consolidated String.Chars
Consolidated Collectable
Consolidated Enumerable
Consolidated IEx.Info
Consolidated Inspect
```
The project is compiled with the `mix compile` command. The compiler will output BEAM bytecode to the `_build` directory.

```bash
$ iex -S mix
```

Once the project has been compiled, you can start the `iex` REPL within the project and access all the project's and modules functions

```bash
$ mix test
Compiled lib/example.ex
Generated example app
Consolidated Collectable
Consolidated List.Chars
Consolidated String.Chars
Consolidated Enumerable
Consolidated IEx.Info
Consolidated Inspect
.

Finished in 0.04 seconds (0.04s on load, 0.00s on tests)
1 test, 0 failures

Randomized with seed 458385
```

Tests can be ran by running the `mix test` command. You can also supply that file name of a particular test suite in order to limit the amount of tests ran. This is very useful when the test suites grow large and you want to your focus on a single feature.

## <a name="reactive_applications"> Reactive applications

	- Have to use phoenix for examples, it's a little too heavyweight for exercises
	- Phoenix has WebSocket channels that can handle communication between subscribers
	- Phoenix fails to run if Node < 4.0 or NPM < 3.0
	

### Game of Life

Life.Board.t is a convention

defomdule Life.Board do
	@type t :: map
end


Enum.scan -- sounds good for primes
Enum.unfold --- for fibonacci