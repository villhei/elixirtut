[lambda]: img/lambda.png

<!-- TOC -->

- [Tuples](#tuples)
- [Lists](#lists)
- [Keyword lists](#keyword-lists)
- [Maps](#maps)

<!-- /TOC -->

## Tuples

Functional programmers often find the need to return more than a single value from a function. These sets of values can be represented as tuples, which are ordered pairs of n elements. In impreative programming, whenever you want to represent some structured data you normally implement a construct such as a `class` or a `struct` for that purpose. The heavy-weight constructs don't always feel that necessary. That's why most functional languages implement a `tuple` that can act as a container values.

The elements of a tuple are stored contiguously in memory, which means that accessing the elements of a tuple by index, or getting the size of a tuple is a fast operation executed in constant time.

Tuples are commonly used as return values from different kinds of library functions, as a tuple is a handy tool to communicate, for example, both a status code and a result value. Tuples are often used as ad-hoc data structures, as they do not require any sort of ceremony in their declaration.

```elixir
iex> cat = {:cat, "Brown", 5}
{:cat, "Brown", 5}
iex> tuple_size(cat)
3
```

Tuples are defined by using curly brackets. The values contained by a tuple do not need to be of the same type. The `tuple_size/1` can be used to find the count of elements stored in a tuple.

```elixir
iex> cat = {:cat, "Brown", 5}
{:cat, "Brown", 5}
iex> tuple_size(cat)
4
iex> elem(cat, 4)
** (ArgumentError) argument error
    :erlang.element(5, {:cat, "Brown", 5})
```

An individual element can be fetched from a tuple by calling the function `elem/2` with the tuple and the index of the desired element. Attempting to access an out-of-bounds element will raise an error.

```elixir
iex> cat = {:cat, 'Brown', 5}
iex> put_elem cat, 1, "Pink"
{:cat, "Pink", 5}
iex> cat
{:cat, 'Brown', 5}
```

Use the `put_elem/3` function to modify an element of a tuple. Notice that all declared variables in Elixir are immutable, and the `put_elem/3` returns a new copy of the original tuple rather than modifying the original element like typically done in eg. Java.

## Lists
<div class="key-concept">
    ![Key concept][lambda]<span>Lists of lists of lists</span>
    <p>Lists play an important role in functional programming in general. The first functional language [LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)) (1958) is in fact an acronym for LISt Processor.</p>

    <p>Lists in Elixir are, as like with most other functional languages, implemented internally as linked lists. It's good to keep this in mind, as it means prepending to a list runs in constant time `O(1)` and thus populating a list from left to right runs in linear time `O(N)`. List is an ordered collection.</p>
</div>

```elixir
iex> [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> length([1,2,3])
3
```

A list can be introduced by enclosing a set of comma separated values within brackets `[]`. You can get the length of a list by calling the function `length\1`. Remember, calculating the length of a linked list runs in linear `O(N)` time.

```elixir
iex> [1, 2, 3] ++ [4, 5, 6]
[1, 2, 3, 4, 5, 6]
```

Two lists can be merged into one or concatenated with the unary function `++`.

```elixir
iex> [1, 2, 3, 4, 5, 6] -- [2, 4]
[1, 3, 5, 6]
iex> [:foo, :bar] -- [:bar]
[:foo]
```
The difference of lists can be obtained by using the `--` operator. This feature is relatively uncommon in languages. Difference returns a copy of the original list with the elements listed on the right-hand side removed.

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

Elixir also features a shorthand syntax for matching the head and the tail of a given list with the operator `|` symbolic for separator. The operator can also be used to prepend items to a list, as shown in the next example.

```elixir
iex> list = [1,2,3]
[1, 2, 3]
iex> [0 | list]
[0, 1, 2, 3]
iex> [1, 2, 3 | 4]
[1, 2, 3, 4]
iex> [0 | [1 | [2,3,4]]]
[0, 1, 2, 3, 4]

```

It is recommended to use the prepend function only to prepend or extract a single element as a head of the list. When prepending more than a single element, things get quite ugly fast.

```elixir
iex> Enum.reverse([1,2,3,4,5])
[5, 4, 3, 2, 1]
```

The module [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) comes with plenty of helpful functions for working with lists. Here we apply the `Enum.reverse/1` function for the list `[1,2,3,4,5]` and unsurprisingly we receive a reversed copy of the list.

```elixir
iex(4)> 3 in [1,2,3,4,5]
true
iex> :cat in [:dog, :pig, :horse]
false
iex> :cat in [:dog, :pig, :horse, :cat]
true
```

Using the `in` operator to check for a value in a list is a convenient way to do searches. Bear in mind that searching a list is a `O(n)` operation, which can be very expensive for long lists.

## Keyword lists

Elixir also provides a variant of the list type, where each element in a list is associated with an atom acting as a keyword for a value. Internally, keyword lists combine the two previous data structures, they are implemented as lists of tuples.

It is important to understand that keyworded lists are precisely lists, and all the list functions and all the normal functions and linear performance characteristics apply as usual.

```elixir
iex> [name: "Bill", name: "Hillary", name: "Donald"]
[name: "Bill", name: "Hillary", name: "Donald"]

```

A keyword list is syntactic sugar for creating lists of tuples. The key must be an atom while the value can hold anything.

```elixir
iex> [first: "Bill", second: "George", third: "Barack"] ++ [fourth: "Donald"]
[first: "Bill", second: "George", third: "Barack", fourth: "Donald"]
```
Keyword lists support the same operations as regular lists, such as joining two lists using the `++` operator.

```elixir
iex> presidents = [first: "Bill", second: "George", third: "Barack", fourth: "Donald"]
[first: "Bill", second: "George", third: "Barack", fourth: "Donald"]
iex> presidents[:first]
"Bill"
iex> presidents[:third]
"Barack"
iex> presidents[:fifth]
nil
```

A keyword can be looked up from the keyword list with the syntax `list_name[:keyword]`. Upon lookup, the first item matching the condition will be returned.

The keyword list allows for creating syntactically pleasant functions in a number of cases. For example, we introduce the conditonal macro `if/2` in a later section.

When the keyword list is the last argument of a function, the square brackets are optional. This allows passing multiple keyworded parameters to a function expecting a list. For example, keyword lists can be used to represent optional option arguments.

## Maps

```elixir
iex> country_capitals = %{:sweden =>  "Stockholm",
...> :finland => "Helsinki",
...> :germany => "Berlin",
...> :spain => "Madrid"}
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
```

Map is a data structure used as a container for key and value pairs. Maps are often used as a sort of dictionary, and it's an efficient way of indexing values for different types of searches and retrievals. Maps also act as base for user-defined types in Elixir.

Unlike lists, maps are not ordered collections.

```elixir
iex> Map.get(country_capitals, :sweden)
"Stockholm"
```

The values contained in a map can be retrieved by calling `Map.get/2` function, which accepts a map and a key as it's parameters and retrieves the value associated with that key in constant `O(1)` time.

```elixir
iex> Map.size(country_capitals)
4
```

The size of a map can be obtained by calling the `Map.size/1` function.

```elixir
iex> Map.put(country_capitals, :netherlands, "Amsterdam")
%{finland: "Helsinki", germany: "Berlin", netherlands: "Amsterdam",
  spain: "Madrid", sweden: "Stockholm"}
iex> country_capitals
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}

```

The `Map.put/3` function is be used to create an updated copy of a map provided as the first argument. The second argument is the new key to be inserted, and the third is the value associated with that key. As we are working with immutable data, the `Map.put/3` returns a copy of the original map with the updated values. The original map still exists in memory as-was.

```elixir
iex> Map.delete(country_capitals, :germany)
%{finland: "Helsinki", spain: "Madrid", sweden: "Stockholm"}
iex> Map.drop(country_capitals, [:spain, :sweden])
%{finland: "Helsinki", germany: "Berlin"}
```

The contents of the map can also be modified with the functions `Map.delete/2` which accepts a map and key to be deleted. For multiple keys, `Map.drop/2` accepts a map and a list of keys to be deleted. The original map is not modified, but a new copy with the values removed is created in both cases.

```elixir
iex> %{} = %{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
```

When performing pattern matching with maps, it's important to notice that an empty map `%{}` as a right-hand side of the match operator `=` matches all maps and can be used as a type guard (more about type guards later on).

```elixir
iex> animal_sounds =  %{cow: "Moo!", dog: "Woof!", cat: "Meeoow!"}
%{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"}
iex> animal_sounds.cow
"Moo!"
iex> animal_sounds.snake
** (KeyError) key :snake not found in: %{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"}

iex> Map.get(animal_sounds, :snake)
nil
```

Given all the keys in a map are strings or atoms, you can also use the `keyword:` syntax for associating keys with values in a map. Also when all your keys are defined as keywords, one can access the map with a special syntax `map.key` instead of using the `Map.get/2` function.

Notice that the `map.key` syntax for accessing the map is strict. A non-existent key will raise an error, unlike the non-strict `Map.get/2` that will instead return a `nil`. This can create unexpected crashes, when a map is populated dynamically.

```elixir
iex> %{ animal_sounds | :snake => "Hsssst!"}
** (KeyError) key :snake not found in: %{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"}
    (stdlib) :maps.update(:snake, "Hsssst!", %{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"})
    (stdlib) erl_eval.erl:255: anonymous fn/2 in :erl_eval.expr/5
    (stdlib) lists.erl:1262: :lists.foldl/3
iex> %{ animal_sounds | :dog => "WOOOF!"}
%{cat: "Meeoow!", cow: "Moo!", dog: "WOOOF!"}

```

The syntax `%{map_name | :key => value}` can be used to *update* a value in a map. The update requires the value to be present. An error will be raised for non-existent keys. If you wish to *insert* a value in to a map, use `Map.put/3` instead.