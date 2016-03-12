[lambda]: img/lambda.png
## <a name="data_structures_tuples"></a> Tuples

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

## <a name="data_structures_list"></a> Lists

Lists play an important role in functional programming in general. The first functional language [LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)) (1958) is in fact an acronym for LISt Processor.

Lists in Elixir, as like with most other functional languages, are implemented internally as linked lists. It's good to keep this in mind, as it means prepending to a list runs in constant time `O(1)` and thus populating a list from left to right runs in linear time `O(N)`. List is an ordered collection.

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
iex> [0 | [1 | [2,3,4]]]
[0, 1, 2, 3, 4]

```

It is recommended to use the prepend function only to prepend or extract a single element as a head of the list. When prepending more than a single element, things get quite ugly fast.

```elixir
iex> Enum.reverse([1,2,3,4,5])
[5, 4, 3, 2, 1]
```

The module [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) comes with handful of helpful functions for working with lists. Here we apply the `Enum.reverse/1` function for the list `[1,2,3,4,5]` and unsprisingly we receive a reversed copy of the list.

## <a name="data_structures_keyword_lists"></a> Keyword lists

Elixir also provides a variant of the list, where each element in a list is associated with an atom acting as a keyword. Internally, keyword lists combine the two previous data structures as being lists of tuples.

It is important to understand that keyworded lists are precisely lists, and all the list functions and all the normal functions and linear performance characteristics apply as usual.

```elixir
iex> [name: "Bill", name: "Hillary", name: "Donald"]                   
[name: "Bill", name: "Hillary", name: "Donald"]

```

A keyword list is syntactic sugar for creating lists of tuples with non-unique keys. The key must be an atom while the value can hold anything.

```elixir
iex> [name: "Bill", name: "Hillary", name: "Donald"] ++ [name: "Abe"]
[name: "Bill", name: "Hillary", name: "Donald", name: "Abe"]

```

```elixir
iex> people = [name: "Bill", last_name: "Clinton", name: "Donald", last_name: "Trump"]
[name: "Bill", last_name: "Clinton", name: "Donald", last_name: "Trump"]
iex> people[:name]
"Bill"
iex> people[:last_name]
"Clinton" 
```

A keyword can be looked up from the keyword list with the syntax `list_name[:keyword]`. Upon lookup, the first item matching the condition will be returned.

The keyword list allows for creating syntactically pleasant functions in a number of cases. For example, we introduce the conditonal macro `if/2` in a later section.

When the keyword list is the last argument of a function, the square brackets are optional. This allows passing multiple keyworded parameters to a function expecting a list.

## <a name="data_structures_streams_and_ranges"></a> Streams and ranges

##  <a name="data_structures_maps"></a> Maps

```elixir
iex> country_capitals = %{:sweden =>  "Stockholm", 
...> :finland => "Helsinki", 
...> :germany => "Berlin", 
...> :spain => "Madrid"}
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
```

Map is a data structure used as a container for pairs with a key and a value. Maps are often used as a sort of dictionary, and it's an efficient way of indexing values for different types of searches and retriavals. 

Unlike lists, maps are not ordered collections.

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

```elixir
iex> %{} = %{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
%{finland: "Helsinki", germany: "Berlin", spain: "Madrid", sweden: "Stockholm"}
```

When performing pattern matching with maps, it's important to notice that an empty map `%{}` as a right-hand side of the match operator `=` matches all lists.

```elixir
iex> animal_sounds =  %{cow: "Moo!", dog: "Woof!", cat: "Meeoow!"}
%{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"}
iex> animal_sounds.cow
"Moo!"
iex> animal_sounds.snake
** (KeyError) key :snake not found in: %{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"} 

```

When all the keys in a map are atoms, you can also use the `keyword:` syntax for associating keys with values in a map. Also, one can access the map with a special syntax `map.key` instead of using the `Map.get/2` function. 

Accessing the map with a non-existant key will raise an error.

```elixir
iex> %{ animal_sounds | :snake => "Hsssst!"}
** (KeyError) key :snake not found in: %{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"}
    (stdlib) :maps.update(:snake, "Hsssst!", %{cat: "Meeoow!", cow: "Moo!", dog: "Woof!"})
    (stdlib) erl_eval.erl:255: anonymous fn/2 in :erl_eval.expr/5
    (stdlib) lists.erl:1262: :lists.foldl/3
iex> %{ animal_sounds | :dog => "WOOOF!"}   
%{cat: "Meeoow!", cow: "Moo!", dog: "WOOOF!"}

```

The syntax `%{map_name | :key => value}` can be used to *update* a value in a map. The update requires the value to be present and for non-existant keys an error will be raised.
