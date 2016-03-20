[lambda]: img/lambda.png

<div class="key-concept">
    ![Key concept][lambda]<span>Laziness as a virtue</span>
    <p>In addition to lists Elixir provides a list-like structure called a stream. A stream is a lazily evulated counterpart of a list. The laziness means, that after declaration, the value of a list is not necessarily evaluated immediately, but will be accessible when some eager function requires it.</p>

    <p>Eager in this context refers to functions that demand a result right away. All the high-order functions found from the Enum module are examples of eager functions. The module `Stream` provides for lazy counterparts of the functions in the `Enum` module. Unlike eager functions, the evaluation of lazy functions does not require (often a chain of) expressions to be evaluated right away. The evaluation of expressions defined using lazy constructs is delayed until something eager wants to access them. </p>

    <p>Laziness proves itself useful in many situations. The programmer can defined never-ending streams (lists) of data and access only the portions of the data one needs. They can be, for example be used as generators for fibonacci numbers or primes.</p>
</div>

## Streams

Elixir streams are lazy, ordered collections implementing the [Enumerable protocol](http://elixir-lang.org/docs/stable/elixir/Enumerable.html). Streams can be manipulated with eager functions from the [Enum module](http://elixir-lang.org/docs/stable/elixir/Enum.html) and with lazy functions from the [Stream module](http://elixir-lang.org/docs/stable/elixir/Stream.html). Let's take a look at creating some streams.

```elixir
iex> abc_cycle = Stream.cycle([:a, :b, :c])
#Function<59.71479995/2 in Stream.unfold/2>
```

We start by defining a stream with `Stream.cycle/1`. The function takes an enumerable as parameter and cycles through it infinitely. In these case, the stream produces a list `[:a, :b, :c, :a, :b ...]`. 

Observe that instead of the `iex` shell displaying a value like usual, the `Stream.cycle/1` returns a function representing the underlying evaluation.

```elixir
iex> abc_cycle |> Stream.drop(2)
#Stream<[enum: #Function<59.71479995/2 in Stream.unfold/2>,
 funs: [#Function<5.71479995/1 in Stream.drop/2>]]>
```

The `Stream.drop/2`, like it's eager counterpart `Enum.drop/2` drops `n` elements from the head of the stream. Notice that we still do not have any evaluation, but instead the list of functions associated with the stream is starting to grow.

```elixir
iex> abc_cycle |> Stream.drop(2) |> Enum.take(4)
[:b, :c, :a, :b]
```

It's about time to prove the stream really works as advertised. Now that we are applying an eager function `Enum.take/2` on the stream, we are starting to see some results, as it returns a good old fashioned list of items.

```elixir
iex> powers_of_two = Stream.unfold(2, fn n -> {n, n*2} end)
#Function<59.71479995/2 in Stream.unfold/2>
iex> powers_of_two |> Enum.take(8)
[2, 4, 8, 16, 32, 64, 128, 256]
```

Streams can be easily used as generator values to generate infinite lists of results of arithmetic expressions. The addition to the `Stream.cycle/1` the function `Stream.unfold/2` is an example of a generator function that is sort of a reversed version of the `Enum.reduce/2` function.

`Stream.unfold/2` accepts two parameters: an initial accumulator value and a function `fn/1` accepting the accumulator value and returning an tuple with the left-hand side containing the result of the expression, and the right-hand side providing an accumulator value for the next successive evaluation. 

```elixir
iex> [1, 2, 3] |> Enum.map(fn n ->
      IO.puts("First: #{n}")
      n
    end) |> Enum.map(fn n ->
      m = n * 2
      IO.puts("Second: #{m}")
      m
    end)
First: 1
First: 2
First: 3
Second: 2
Second: 4
Second: 6
[2, 4, 6]
```

Consider the above example of the function `Enum.map/2` applied sequentially on the list `[1, 2, 3]`. The first call to `Enum.map/2` is defined to return the value `n` as-is while using `IO.puts/1` for printing the value `n`. `Enum.map/2` iterates through the entire list, returning a new, yet value-wise identical list `[1, 2, 3]`. 

The second call to `Enum.map/2` is defined to multiply the value `n` by a factor of 2, print the value using `IO.puts/2` and to return the multiplied value.

The printed output clearly shows, that the order of evaluation was precisely what we expected. Now let's try the same with functions from the `Stream` module. 

```elixir
iex> [1, 2, 3] |> Stream.map(fn n ->
      IO.puts("First: #{n}")
      n
    end) |> Stream.map(fn n ->
      m = n * 2
      IO.puts("Second: #{m}")
      m
    end) |> Enum.to_list
First: 1
Second: 2
First: 2
Second: 4
First: 3
Second: 6
[2, 4, 6]
```

We pipe the results of the lazy `Stream.map/2` calls to the eager `Enum.to_list` function in order to force the evaluation of the streams. Now that the evaluation was required, we see some interesting results: The order of evaluation changed, and quite radically if I may say so!

Like we saw on previous examples, an unevaluated stream is a sequence of functions defining the value of the elements of the stream. Whenever we apply an eager function (`Enum.to_list` in this case) that accesses an element in the stream, this causes the defined sequence of functions to be applied for each element in order to obtain the stream's final, resulting value. 

This is the feature in streams that allow you to define infinite sequences of values - the unneeded trailing values are just never evaluated. 

```elixir
iex> Stream.unfold({0, 1}, fn {n, m} -> {n, {m, n + m}} end) |> Enum.take(10)
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

Did I hear someone say "fibonacci sequence"? The `Stream.unfold/2` can be used with any kinds of values, not limited to just plain numbers. The above call to `Stream.unfold/2` uses a tuple `{0, 1}` as the initial accumulator. By using pattern matching, the `fn/1` defined as a second parameter extracts the values `{n, m}` from the tuple, and returns another tuple `{n, {m, n + m}}`, where `n` is the number returned in the current iteration. `m` represents the "next number" and the expression `n + m` represents the one after next. Quite neat, if I may say so.

```elixir
iex> Stream.unfold(1, fn 10 -> nil; n-> {n, n+1} end) |> Enum.to_list()
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

One interesting feature of `Stream.unfold/2` is the ability for the programmer to provide a pattern of functions. The function still accepts two parameters, but instead of a single function as the second parameter, we supply two alternative bodies to choose from by matching the accumulator value. 

If the function returns a `nil`, `Stream.unfold/2` will treat it as the end of the stream. In any other case `Stream.unfold/2` will continue evulation as required. 

In addition to manually defining streams, many libraries and modules, such as the [File module](http://elixir-lang.org/docs/stable/elixir/File.html) provide streaming functions to allow for delayed or on-demand access to resources. There is a future chapter dedicated to functions from the `File` module, but let's take a look at how streaming a file works.

```elixir
input = File.stream!("war_and_peace.txt")
indices = Stream.unfold(1, fn(n) -> {n, n+1} end)
 
result =  Stream.zip(indices, input)
  |> Stream.filter(fn {_, line} -> Regex.match?(~r/\b[Ww]ar[s]*\b/, line) end)
  |> Stream.map(fn {i, line} -> {i, String.replace(line, "\n", "")} end)  

line_count = length(Enum.to_list(input))
line_count_war = length(Enum.to_list(result))

result |> Enum.each(fn {i, line} -> IO.puts("#{i}: #{line}") end)

IO.puts("\nOf #{line_count} lines, #{line_count_war} contained the word \"war\"")
```

```bash
$ elixir war_and_peace.exs 
1: The Project Gutenberg EBook of War and Peace, by Leo Tolstoy
....
34796: that, he had experience enough to know that nothing happens in war at

Of 35092 lines, 165 lines contained the word "war"
```

Our sample script is a program, that reads all the lines from the novel *War and Peace* by Fyodor Dostoyevsky and filters the lines that contain the word war. 

First we use the `File.stream!/1` to open up a file stream from the file `war_and_peace.txt`. Then `Stream.unfold/2` function is called to create a sequence from 1 to infinity in order to keep track of line numbers. `Stream.zip/2` is used to combine the line numbers with the input file, creating a stream of tuples `{n, line}`. 

Then the action starts. `Stream.filter/2` is used to match a given line against a regex test. Lines passing the test, are given to `Stream.map/2`, which removes the newline `\n` characters from the string in order to prettify our printing. The `Stream.map/2` is placed after the filter step, in order to limit the sample size.

Then we transform the streams to lists using `Enum.to_list/1` and obtain their length by calling the `length` function. Finally we print all the matching lines, and the results of our novel analysis (pun intended).

Notice that we are we're doing something ugly here.

```elixir
line_count = length(Enum.to_list(input))
line_count_war = length(Enum.to_list(result))
```

We are transforming both the `input` and the `result` streams to lists, in order to obtain their length. In imperative languages, you probably would have wanted to count the lines while doing a pass over the `input` in the `Enum.filter/2` step, but as we are working in a functional language, we cannot reference a value outside the function scope let alone change it.

We can think, that we have defined `line_count` as the length of the input, and `line_count_war` as the line count of the result. This is quite a much more elegant, than the imperative approaches, but in this specific case, it also comes at a cost of performance as the list needs to be unnecessarily traversed multiple times.

```java
  int lineCount = 0;
  for(int i = 0 ; i < lines.length ; ++i) {
    lineCount++;
    /** code here **/
  }
```

The imperative approach would be better here, as counting the lines would not need the several hundred thousand unnecessary instructions forced upon us by the functional approach.

## Ranges

Ranges are a yet another syntactic convenience in Elixir. Ranges are meant for the use of gentlemen, who want to avoid unnecessarily defining of trivial things. Internally the range is represented by a struct, but implemented as a stream.

```elixir
iex> 1..100
1..100
iex> 11..20
11..20
```

A range can be defined by entering a starting integer `n` followed by the operator `..` and a final integer `m` representing the end of range. The operator `..` will return stream of numbers between the integers `n` and `m`.

```elixir
iex> 1.0..10.0
** (ArgumentError) ranges (first..last) expect both sides to be integers, got: 1.0..10.0
    (elixir) expanding macro: Kernel.../2
             iex:24: (file)
```

The range operator `..` only works with integers. Lucky for us, the syntax with floats would have been horrible anyway.

```elixir
iex> first..last = 1..10
1..10
iex> first
1
iex> last
10
```

A range can also be used in pattern matching with the match operator `=` as a left-hand side pattern. We also demonstrated using the range in guard expressions earlier.

```elixir
iex> squares = 1..10 |> Stream.map(fn n -> n * n end)
#Stream<[enum: 1..10, funs: [#Function<32.71479995/1 in Stream.map/2>]]>
iex> Enum.to_list(squares)
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

Ranges can also be manipulated with the lazy functions from the `Stream` module as like with the eager functions in the `Enum` module. A list is not necessarily infinite as demonstrated by our brave attempt to transform it to a list using the function `Enum.to_list/1`.
