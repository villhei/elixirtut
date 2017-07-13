[lambda]: img/lambda.png

<!-- TOC -->

  - [Summary of common sample sizer functions](#summary-of-common-sample-sizer-functions)
  - [Summary of sample manipulation functions](#summary-of-sample-manipulation-functions)
- [Sample sizer functions](#sample-sizer-functions)
    - [Enum.take/2](#enumtake2)
    - [Enum.drop/2](#enumdrop2)
    - [Enum.take_while/2](#enumtake_while2)
    - [Enum.drop_while/2](#enumdrop_while2)
  - [Enum.map/2](#enummap2)
  - [Enum.filter/2](#enumfilter2)
  - [Enum.zip/2](#enumzip2)
  - [Enum.reduce/3](#enumreduce3)
- [The pipe operator](#the-pipe-operator)

<!-- /TOC -->

<div class="key-concept">
![Key concept][lambda]<span>High-order functions</span>
<p>High-order functions are functions that accept functions as their arguments or return a function as their result.</p>

<p>Elixir's [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module provides a familiar set of high-order functions often found in other functional languages. </p>
</div>

The often used high-order functions we are about to look into are `map/2`, `filter/2`, `zip/2` and `reduce/3`.

The high-order functions here are supplied by the [Enum module](http://elixir-lang.org/docs/stable/elixir/Enum.html), and equivalent lazy functions can be found from the [Stream module](http://elixir-lang.org/docs/stable/elixir/Stream.html). When working with collections, you can think of these functions as generalizations or replacements of loop constructs.

High order functions and lambda functions are best friends, as the loop-abstracting nature of high-order functions is commonly complemented with throw-away lambda functions expressing the action of the loop. Using lambda functions with common high-order functions is good practice, as a lambda is often more explicit about it's actions than a named function as a parameter.

Usage of the functions found in the `Enum` and `Stream` module is highly encouraged. Usage of these functions is in favor of your own implementations is good programming practice and their semantics explicit to other programmers. The implemenations of library functions are also optimized by a varying degree, so their execution time is also faster than their manually implemented counterparts.

### Summary of common sample sizer functions

<table class="table">
  <thead>
    <tr>
      <td>Function</td><td>Parameters</td><td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
         `Enum.filter/2`
      </td>
      <td>
        1. Enumerable  <br>
        2. `function/1` returning a condition with an element passed as a parameter
      </td>
      <td>
        Create a new enumerable of the same type from the elements that satisfy a given condition
      </td>
    </tr>
    <tr>
      <td>
        `Enum.take/2`
      </td>
      <td>
        1. Enumerable <br>
        2. `n` elements to take
      </td>
      <td>
        Returns a new Enumerable with `n` first elements
      </td>
    </tr>
    <tr>
      <td>
        `Enum.drop/2`
      </td>
      <td>
        1. Enumerable <br>
        2. `n` elements to take
      </td>
      <td>
        Returns a new Enumerable without `n` first elements
      </td>
    </tr>
    <tr>
      <td>
        `Enum.take_while/2`
      </td>
      <td>
        1. Enumerable <br>
        2. Predicate function `function/1`
      </td>
      <td>
         Return an Enumerable with first elements until the predicate `function/1` finds an element it yields a false for
      </td>
    </tr>
    <tr>
      <td>
        `Enum.drop_while/2`
      </td>
      <td>
        1. Enumerable <br>
        2. Predicate `function/1`
      </td>
      <td>
        Return a new Enumerable without the first elements until the predicate `function/1` yields a false
      </td>
    </tr>
  </tbody>
</table>

### Summary of sample manipulation functions

<table class="table">
  <thead>
    <tr>
      <td>Function</td><td>Parameters</td><td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        `Enum.map/2`
      </td>
      <td>
        1. Enumerable <br>
        2. `function/1` with an element passed as a parameter, returns a transformed value
      </td>
      <td>
        Transform (map) all elements of an enumerable from type A to type B
      </td>
    </tr>
    <tr>
      <td>
        `Enum.flat_map/2`
      </td>
      <td>
        1. Enumerable <br>
        2. `function/1` with an element passed as a parameter, returns an Enumerable
      </td>
      <td>
        Just like map, transform (map) all elements of an Enumerable returning a flat list of joined Enumerables
      </td>
    </tr>
    <tr>
      <td>
        `Enum.zip/2`
      </td>
      <td>
        1. Enumerable A<br>
        2. Enumerable B
      </td>
      <td>
        Merge all elements of two enumerables A and B to an enumerable of tuples `{A, B}`. The `zip/2` terminates when either one runs out of elements.
      </td>
    </tr>
    <tr>
      <td>
        `Enum.reduce/3`
      </td>
      <td>
      1. Enumerable  <br>
      2. An initial value  <br>
      3. `function/2` with the accumulator value and an element of a list as parameters.
      </td>
      <td>
       Reduce all the elements of an enumerable to a single element. The reducer function starts with the initial value and the first item, and passes the return value as the accumulator to the subsequent call
      </td>
    </tr>
  </tbody>
</table>

A more complete list of functions is documented in the [Enum](http://elixir-lang.org/docs/stable/elixir/Enum.html) module.


## Sample sizer functions

Let's take a look at functions that are used to limit the sample size of an `Enumerable`. These functions are used to create subcollections of `Enumerables`, either by removing leading or trailing elements, or removing elements that fulfill or fail a condition given by a predicate function.

#### Enum.take/2

```elixir
iex> list = [1, 2, 3, 4, 5, 6]
iex> Enum.take(list, 2)
[1, 2]
iex> map = %{:wafu => :steak, :wagyu => :beef}
iex> Enum.take(map, 1)
[wafu: :steak]
iex> length(Enum.take(map, 1))
1
```

One of the simplest functions in the `Enum` module is the `Enum.take/2`, which can be used to create a new sublist of a `Enumerable` from the `n` first elements. Notice that applying `Enum.take/2` on a `Map` translates to a keyword list.

```
iex> Enum.take(list, 6)
[1, 2, 3, 4, 5, 6]
iex> Enum.take([], 1)
[]
```

Attempting to call `Enum.take/2` on a enumerable with less than `n` elements will return all the elements of the `Enumerable` as a list or an empty list.

#### Enum.drop/2

```elixir
iex> list = [1, 2, 3, 4, 5, 6]
iex> Enum.drop(list, 2)
[3, 4, 5, 6]
```

`Enum.drop/2`, is just like `Enum.take/2`, but it is used to create a new list from the input's contents without the `n` first elements.

```
iex> Enum.drop(list, 7)
[]
iex> Enum.drop([], 1)
[]
```

For empty `Enumerables`, `Enum.drop/2` on a enumerable with less than `n` elements will return all the elements of the `Enumerable` as a list or an empty list.

#### Enum.take_while/2

```elixir
iex> Enum.take_while([1, 2, 3, 4, 5, 6], fn n -> n < 4 end)
[1, 2, 3]
```

`Enum.take_while/2` is a similar function to `Enum.take/2`, but instead of a count, it takes a predicate function `fn/1` that is used to test each of the values in the input `Enumerable`. `Enum.take/2` returns a list with all the preceding elements to the element it first yielded a `false` or `nil` for. In our example, the number 4 was the first one to fail the test `n < 4`, so we receive a list with the numbers `[1, 2, 3]`

```elixir
iex> Enum.take_while(["a", "b", "c", "d", "e", "g", "a"], fn str -> str !== "e" end)
["a", "b", "c", "d"]
```

The use of `Enum.take_while/2` is in no way limited to numbers, but can be applied to use any kinds of values you can imagine a boolean expression for.

#### Enum.drop_while/2

```elixir
iex> Enum.drop_while([1, 2, 3, 4, 5, 6], fn n -> n < 4 end)
[4, 5, 6]
```

`Enum.drop_while/2` is a function similar to `Enum.take_while/2`, but instead of taking, it drops values until the predicate function `fn/1` yields a `false`.  `

###  Enum.map/2

```elixir
iex> list = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> Enum.map(list, fn(x) -> x*x end)
[1, 4, 9, 16, 25]
```

The `map/2` is a function that accepts a variable of a type implementing the [Enumerable](http://elixir-lang.org/docs/stable/elixir/Enumerable.html) protocol (ie. a list, a map or a stream) as it's first parameter and a function accepting an element of the type.

`map/2` iterates over the `Enumerable` collection and executes the function for each of the elements within the collection, creating a new transformed instance of the collection as a result. Notice that operations performed within the `map/2` operation do not affect the original collection, but create a new transformed collection.

More formally, `map/2` is a function used to *map* (transform) an `Enumerable` of type A to type B.

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

### Enum.filter/2

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
iex> matches = Enum.filter(names, fn(n) -> String.contains?(n, "Ruohonen") end)
["Matti Ruohonen", "Teppo Ruohonen"]
iex> Enum.map(matches, fn(n) ->
...>   name_parts = String.split(n, " ")
...>   hd(name_parts)
...> end)
["Matti", "Teppo"]
```

The `filter/2` function is often used together with other high order functions, like with the `map/2` used in this example. First the list of people is transformed to list of names. We are only interested in the names that include the string "Ruohonen", which we check for with the `String.contains?/2` function from the [String](http://elixir-lang.org/docs/stable/elixir/String.html) module. For the filtered list, we perform yet another `map/2` to split the names in to parts, of which we grab the first elements of.

### Enum.zip/2

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

```elixir
iex> Enum.zip(["a", "b", "c", "d"], 0..3)
[{"a", 0}, {"b", 1}, {"c", 2}, {"d", 3}]

iex> Enum.with_index(["a", "b", "c", "d"])
[{"a", 0}, {"b", 1}, {"c", 2}, {"d", 3}]

```
Generally speaking, the purpose of the `zip/2` function is simply what we stated, but the use cases are endless. For example, one might require to merge two lists of arbitrary values together, in order to process them further with other high-order functions, or one simply might require an index element of every item in the list, which would be case for `zip/2`. The `zip/2` function is so commonly used for indexing, that there exists a short-hand function `with_index/1` for this purpose.

### Enum.reduce/3

```elixir
iex> numbers = [1,2,3,4,5]
[1, 2, 3, 4, 5]
iex> sum = Enum.reduce(numbers, 0, fn(n, acc) -> acc + n end)
15
```

The `reduce/3` function is used to reduce the values of an `Enumerable` to a single value. `reduce/3` accepts three paremeters, a collection, an initial value and a function. The parameter function has two params `(n, acc)` of which the `acc` is the initial accumulator value or the value returned by the previous iteration of the function and `n` is the value of the current element. The previous example simply sums the elements of the list.

```elixir
iex> names = ["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
["Matti Ruohonen", "Teppo Ruohonen", "Seppo Räty"]
iex> Enum.reduce(names, "", fn(name, acc) -> acc <> name <> "!!!11 " end)
"Matti Ruohonen!!!11 Teppo Ruohonen!!!11 Seppo Räty!!!11 "
```

Like with other functions introduced, the function accepted as a parameter to `reduce/3` can work with any input data data type, and reduce the input  to any kind of value.

```java
int sum = 0;
for(int i = 1 ; i < 6 ; ++i) {
    sum += i;
}
// sum = 15
```

An imperative example of a use case for `reduce/3` is a side-effecting `for`-loop (the loop has effects outside it's own block) used to calculate a sum of a range, using value accumulation. The final value of the sum is 15, just like shown in the first example of the `reduce/3` function.

```elixir
iex> [1,2,3,4,5] |> Enum.reduce(&(&1 + &2))
15
```

The Elixir shown initially is such an messy example of Elixir and functional programming, that an alternative syntax has to be shown here. Elixir sports a feature called *function capturing*, which makes the situation quite a bit neater. We'll introduce function capturing in better detail in a later chapter, but rest assured - there is light at the end of the tunnel.

## The pipe operator

We noticed that when applying several high-order functions sequentially, the code starts to lose some of it's beautiful, minimalistic elegance. Luckily we have the pipe operator `|>` that is used to chain or pass the value on the left-hand side of the operator to the function on the right-hand side. In it's behavior the pipe operator `|>` is very similar to the traditional UNIX `|` operator.

```elixir
iex> sum_of_squares = [1,2,3,4,5]
...> |> Enum.map(fn(x) -> x*x end)
...> |> Enum.reduce(0, fn(n, acc) -> n + acc end)
55
```

In the example above, the pipe `|>` passes an array of numbers to the `map/2` function. The `map/2` passes the resulting array of squared values to the `reduce/3` function that calculates the sum of squares.

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

The use of the pipe `|>` operator is by no means limited to the functions from the `Enum` module. You can use it any time you need to pass the result of the previous function as the first argument to the next function.