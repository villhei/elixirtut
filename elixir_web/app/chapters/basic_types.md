[lambda]: img/lambda.png
[warning]:


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
iex> 0b1010     # integer, binary -> 10
iex> 0o111      # integer, octal -> 73
iex> 0x1FF      # integer, hex -> 511
iex> 1.0        # float
iex> 1.23e+3    # float, exponent -> 1230.0
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

| Operator | Elixir | Java  |
| -------- | ------ | ----- |
| And      |`and`   | `&& ` |
| Or       |`or`    | <code>&#124;&#124;</code>  |
| not      |`not`   | `!`   | 

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

<div name="exercises_week0" class="exercise-container">
<span class="group-name">Warmup exercises</span>
<p>The exercises for this set can be previewed in exercise_drafts/week0.ex</p>
</div>

### A few words on immutability
<div class="key-concept">
![Key concept][lambda]<span>Immutability</span>
<p>Like most functional languages, Elixir favors immutable data. Immutability means, that a value cannot, and there is no way to change once a it has been declared. Immutability has lots of benefits to it, especially when it comes to parallel processing. Usually the challenges of parallel and asynchronous computation lies in the mutation of the state. All the writes by different parallel units of processing must carefully lock the data they write to and simultanous access to writable data structures is in practice very error prone.</p> 

<p>Immutable data completely avoids many shortcomings of using mutable values. Then again immutability is not a silver bullet nor without downsides. Immutability can be very costly, when there is an actual need to update a value, since every time we want to chang data, the previous value needs to be copied to the new value - which can be expensive for complex data structures.</p>

<p>Without a way to mutate values, the internal application state becomes an interesting topic. There are several constructs which allow to upkeep of an application state, such as state machines and actors. </p>
</div>

```elixir
iex> pekka = %{name: "pekka", age: 27}
%{age: 27, name: "pekka"}
iex> teppo =  Map.put(pekka, :name, "teppo")
%{age: 27, name: "teppo"}
iex> pekka
%{age: 27, name: "pekka"}
```

The immutable data in general can be observed in functions manipulating  data structures. Instead of mutating the original data structures, the functions return a new copy of data with the updated values.

It is also important to note that unlike data, variables are free to be re-assigned.

```elixir
iex> teppo_copy = teppo
%{age: 27, name: "teppo"}
iex> teppo = Map.put(teppo, :name, "some other teppo")
%{age: 27, name: "some other teppo"}
iex> teppo
%{age: 27, name: "some other teppo"}
iex> teppo_copy 
%{age: 27, name: "teppo"}

```

On the first line, we assign a new reference `teppo_copy` to the data referenced by the variable `teppo`. Variable `teppo` is then re-assigned to point to the new copy of the data returned by the `Map.put/3` function. Even though the function does not mutate the map pointed by `teppo`, the Elixir runtime allows the user to re-assign the variable to point to the newly updated map.

It's also noteworth to observe, that in case of every assignment, the Elixir interpreter evaluates the value assigned as the return value of the expression. Everything is an expression, even if it looks like a statement.

### <a name="pin_operator"></a> Pin operator


## <a name="advanced_techniques"></a> Advanced techniques

### <a name="advanced_techniques_fun_capture">Function capturing</a>

```elixir
iex> [1, 2, 3, 4, 5] |> Enum.map(&(&1 * &1))    
[1, 4, 9, 16, 25]

```

Elixir provides a special syntax for function capturing with the `&` operator prepending the function. The `&` operator can be used to condence the lambda function syntax even further. The function `&(&1 * &1)` passed for the `Enum.map/2` is strictly equivalent to the function `fn n -> n * n end`.

### <a name="advanced_techniques_currying"></a> Currying
<div class="key-concept">
![Key concept][lambda]<span>Currying</span>
<p>Currying is an often used technique in functional programming languages to translate functions with multiple parameters (arity of n where n > 1) into a sequence  of functions that accept a single parameter (arity of 1).</p>

<p>Currying is not built in to the Elixir core language, so we define a module for transforming functions.</p>
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