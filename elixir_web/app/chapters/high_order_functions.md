[lambda]: img/lambda.png

<div class="warning">
  <span>TODOS</span
  <ul>
    <li>Enum.takeWhile / Enum.dropWhile, Enum.take / Enum.drop</li>
  </ul>
</div>

<div class="key-concept">
![Key concept][lambda]<span>High-order functions</span>
<p>High-order functions are functions that accept functions as their arguments or return a function as their result.</p> 

<p>Elixir's [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module provides a familiar set of high-order functions often found in other functional languages. </p>
</div>

The often used high-order functions we are about to look into are `map/2`, `filter/2`, `zip/2` and `reduce/3`.

The high-order functions here are supplied by the [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module, and equivalent lazy functions can be found from the [Stream](http://elixir-lang.org/docs/stable/elixir/Stream.html) module. When working with collections, you can think of these functions as generalizations or replacements of loop constructs.

High order functions and lambda functions are best friends, as the loop-abstracting nature of high-order functions is commonly complemented with throw-away lambda functions expressing the action of the loop. Using lambda functions with common high-order functions is good practice, as a lambda is often more explicit about it's actions than a named function as a parameter.

#### Summary of the common high order functions

| Function   | Parameters | Description |
| ---------- | ---------- | ----------- |
| `Enum.map/2`    | 1. Enumerable  2. `function/1` with an element passed as a parameter | Transform (map) all elements of an enumerable from type A to type B |
| `Enum.filter/2` | 1. Enumerable  2. `function/1` returning a condition with an element passed as a parameter | Create a new enumerable of the same type from the elements that satisfy a given condition |
| `Enum.zip/2`    | 1. Enumerable A  2. Enumerable B | Merge all elements of two enumerables A and B to an enumerable of tuples `{A, B}`. The `zip/2` terminates when either one runs out of elements. |  
| `Enum.reduce/3` | 1. Enumerable  2. An initial value  3. `function/2` with the accumulator value and an element of a list as parameters. | Reduce all the elements of an enumerable to a single element. The reducer function starts with the initial value and the first item, and passes the return value as the accumulator to the subsequent call|


A more complete list of functions is documented in the [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module. 

#### <a name="high_order_map"></a> Enum.map/2

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
Let's create a list objects representing the most important finnish celebrities and their birth years. Note that celebrities are represented by the `%{}` map *type*.

```elixir
iex> Enum.map(people, fn(person) -> person.name end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]

iex> Enum.map(people, fn(p) -> Map.get(p, :born) end)
[1949, 1948, 1962]

```
In the first case, the `map/2` transforms a list of `Map`s to a list of strings, without mutating the original collection. In the second case, `map/2` transforms the list of `Map`s to a list of strings using the `Map.get/2` function. 

```elixir
iex> names = Enum.map(people, fn(person) -> person.name end)
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]

iex> Enum.map(names, fn(n) -> String.upcase(n) end)  
["MATTI RUOHONEN", "TEPPO RUOHONEN", "SEPPO RÄTY"]
```

`map/2` is often used to formulate *functional pipelines* where the value is transformed multiple times to a new format or type suitable for the next operation. The second call to `map/2` uses the function `upcase/1` from the [String](http://elixir-lang.org/docs/stable/elixir/String.html) module.

#### <a name="high_order_filter"></a> Enum.filter/2

```elixir
iex> list = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> Enum.filter(list, fn(x) -> rem(x, 2) === 0 end)
[2, 4]
```

The `filter/2` is a function that accepts an `Enumerable` and a predicate function. `filter/2` executes the predicate function for each element in the `Enumerable`, and finally returns an `Enumerable` with those elements the predicate yielded `true` for. In the example above, `filter/2` is used to filter odd values out of the resulting collection.

The elements returned by the filter function are of the same type as the input elements, in other words, filter is used to limit the size of a sample when working with `Enumerable` types.

```elixir
iex> names = Enum.map(people, fn(person) -> person.name end)
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

#### <a name="high_order_zip"></a> Enum.zip/2

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

Generally speaking, the purpose of the `zip/2` function is simply what we stated, but the use cases are endless. You sometimes might require the index of the element while performing a `map/2`, the solution is to call `zip/2` on the original list with a second list containing the indices.

#### <a name="high_order_reduce"></a> Enum.reduce/3

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
iex> Enum.reduce(names, "", fn(name, acc) -> acc <> name <> "!!!11 " end)            
"Matti Ruohonen!!!11 Teppo Ruohonen!!!11 Seppo Räty!!!11 "
```

Like the other functions introduced, the `reduce/3` can work with any data type, and reduce the data to any kind of value.

## <a name="pipe_operator"></a> The pipe operator

We noticed that when applying several high-order functions sequentially, the code starts to lose some of it's beautiful, minimalistic elegance. Luckily we have the pipe operator `|>` that is used to chain or pass the value on the left-hand side of the operator to the function on the right-hand side. The pipe operator `|>` is very similar to the traditional UNIX `|` opertor. 

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
...> |> Enum.map(fn(p) -> p.name end)
...> |> Enum.filter(fn(n) -> String.contains?(n, "Ruohonen") end) 
...> |> Enum.map(fn(n) -> String.split(n, " ") end)
...> |> Enum.map(fn(nn) -> hd(nn) end)
...> |> Enum.reduce("", fn(n, acc) -> acc <> n <> " OMG!!! " end)
"Matti OMG!!! Teppo OMG!!! "
```

We can start seeing the benefits of the pipe operator here `|>`. The first step is to extract the names from the persons in people using `map/2`, then we use `filter/2` to check if the name contains the string `"Ruohonen"`, after which we split it to two parts with the `String.split/2`, drop the tail using `hd/1` on the split values and finally use `reduce/3` to reduce the result to a string.

Piping is by no means limited to the functions from the `Enum` module and you can use it any time you need to pass the result of the previous function as the first argument to the next function.