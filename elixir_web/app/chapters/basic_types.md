[lambda]: img/lambda.png

## <a name="hello_elixir"></a>Hello Elixir!

```elixir
IO.puts("Hello Elixir!")
```

Elixir scripts use the extension `.exs` by convention, and elixir source files user the extension `.ex`. Create a file `hello.exs` with the content above. Executing the `elixirc`.

```bash
$ elixir hello.exs 
Hello Elixir!
```

An Elixir script can be executed by using the command `elixir <filename.exs>` . Execute the file you created.

## <a name="basic_types"></a>Basic types

The primitive types in Elixir are a bit different from imperative languages. Like most functional languages, Elixir introduces a simple syntax for tuples and lists. Let's take a look at some common types and their typing formats.

```elixir
iex> 1          # integer
iex> 1_000_000  # integer, 1000000
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

It's worth noticing that the division above returned a float `5.0` instead of an integer, if you want to do division and remainders with integers, you should use the functions `div/2` and `rem/2`.

```elixir
iex> 1_000
1000
iex> 1_000_000
1000000
iex> 1_2_3
123
iex> 1_000_000_000_000_000
1000000000000000

```

Elixir provides a convenient syntax for writing large numbers. The syntax proves itself quite handy sometimes, and doesn't really care about the structure of the number. The the underscore `_` will join together the trailing numbers with the leading numbers.

It's also worth noticing, that Elixir allows for really large integer numbers. In the common case, when the size of the number does not exceed 30 or 60 bytes (32/64 bit systems), the number is stored as 4 or 8 bytes. Larger numbers are stored using N bytes, depending on the number.

```elixir
iex> div(10, 2)
5
iex> div 10, 2
5
iex> rem 10, 3
1
```

In Elixir, parentheses are optional in function invocation. For explicitness and to promoto best practices, parentheses are preferred most of the time in these examples. 

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

Atoms or are constants, whose names are their values. Atoms are sometimes called symbols in other languages. Every atom created during the programs life cycle is stored in an in-memory atom table and never removed. Creating atoms dynamically, say from incoming socket data, is highly discouraged as they might very well consume all your available memory.

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

This concludes our tour of the basic types of Elixir. We left out some types such as `PID` and `Port`, but we'll elaborate some of these as they grow more relevant. More information on these topics can be found from the Elixir [Kernel](http://elixir-lang.org/docs/stable/elixir/Kernel.html) documentation.