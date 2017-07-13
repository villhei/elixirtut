[lambda]: img/lambda.png

<div class="key-concept">
![Key concept][lambda]<span>Pattern matching</span>
<p>Pattern matching in functional languages is a mechanism often used for implementing control flows and guard expressions within functions and expressions. We have seen the operator `=` used earlier for assignment of variables. In reality, the `=` operator in Elixir is called the <b>match operator</b>.</p>

<p>As like pattern matching in other functional languages in general, pattern matching is used to match simple values to a format pattern, pattern matching can also be used to destructure complex data types.</p>
</div>

```elixir
iex> hello = "Perfect match!"
"Perfect match!"
```

The example above matches the right-hand side of the match operator `=` to the left-hand side variable hello, which as en expression, evaluates to the value "Perfect match!" and assigns the value to the variable hello.

```elixir
iex> x = 1
1
iex> 1 = x
1
```

The use of match operator `=` looks a lot like assignments familiar from other programming languages when extracting values from the right-hand side of the match operator. It's good to keep in mind that whatever assigned to the left-hand side of the operator is also a constraint for the right-hand side. Using a variable is like saying "match anything from the right", using a value or a partial value is equivalent to saying "The data should look a lot like the value 1", as presented in the example above.

```elixir
iex> 2 = x
** (MatchError) no match of right hand side value: 1

```

An invalid match will raise an exception. The exceptions are expected behavior and they act as a motivator to handle both valid and invalid cases in matching.

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

Destructuring values using the match operator `=` works by comparing the right-hand side data structure (a tuple in this case) to the pattern `{a, b ,c}` on the left-hand side. Because the pattern matches, the variables a, b, c are assigned the values obtained from the destructured data structure.

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

### The `with` special form

Pattern matching expressions can become a little untidy, when we are working with nested data structures such as nested maps, a common case when working with JSON objects. The Elixir Kernel's [Special Forms](http://elixir-lang.org/docs/stable/elixir/Kernel.SpecialForms.html) module provides a convenient `with/1` macro that comes to our help. `with/1` is used to combine or chain multiple matching clauses. 

```elixir
iex> great_bands = %{ 
    kvelertak: %{
        name: "Kvelertak",
        albums: 
            [
                %{name: "Kvelertak", year: 2010}, 
                %{name: "Meir", year: 2013},
                %{name: "Nattesferd"}
            ]
        },
    bloodred_hourglass: %{
        name: "Bloodred Hourglass",
        albums: 
            [
                %{name: "Lifebound", year: 2012}, 
                %{name: "Where the Oceans Burn", year: 2016}
            ]
        }
}
```

Consider a scenario where we have set up an instance of `Map` in order to perform programmatic searches of great music. The `Map` above is filled with band keys pointing to instances of `Map` offering detailed information on the given artist. 

```elixir
iex> %{kvelertak: band_detail} = great_bands
%{bloodred_hourglass: %{albums: [%{name: "Lifebound", year: 2012},
     %{name: "Where the Oceans Burn", year: 2016}], name: "Bloodred Hourglass"},
  kvelertak: %{albums: [%{name: "Kvelertak", year: 2010},
     %{name: "Meir", year: 2013}, %{name: "Nattesferd"}], name: "Kvelertak"}}
```

The details of the band can be extracted from the `Map` with ease and efficiency using pattern matching. The keyword `kvelertak` fetches the detail of that band, and the left-hand side expression assigns the details of the band to the variable `band_detail`.

```elixir
iex> %{albums: albums} = band_detail
%{albums: [%{name: "Kvelertak", year: 2010}, %{name: "Meir", year: 2013},
   %{name: "Nattesferd"}], name: "Kvelertak"}
iex> albums
[%{name: "Kvelertak", year: 2010}, %{name: "Meir", year: 2013},
 %{name: "Nattesferd"}]
```

Going a bit deeper, we fetch a list of albums of the band by matching against the keyword `albums`, and assigning the associated map in the slightly confusing variable `albums`. The albums contains a list of the band's albums represented by `Map`s.

```elixir
defmodule Bands do
  def get_albums(bands, band) do
    case bands do
      %{^band => band_detail} ->
        case band_detail do
          %{albums: albums} -> albums
      end
    end
  end
end 
```

If we wanted to perform the same steps programmatically in order to provived general set of functions for working with bands, we could nest two pattern matching expressions to a chained action like demonstarted in the example above. Notice the use of the pin operator `^` when matching against the `:atom` bound to the variable `band`. 

```elixir
iex> Bands.get_albums(great_bands, :kvelertak)
[%{name: "Kvelertak", year: 2010}, %{name: "Meir", year: 2013},
 %{name: "Nattesferd"}]
 
iex)> Bands.get_albums(great_bands, :justin_bieber)
** (CaseClauseError) no case clause matching: %{bloodred_hourglass: %{albums: [%{name: "Lifebound", year: 2012}, %{name: "Where the Oceans Burn", year: 2016}], name: "Bloodred Hourglass"}, kvelertak: %{albums: [%{name: "Kvelertak", year: 2010}, %{name: "Meir", year: 2013}, %{name: "Nattesferd"}], name: "Kvelertak"}}
    iex:16: Bands.get_albums/2
```

Now we have a convenient interface for extracting information about bands. When given a key that exists in the `Map` of great bands, our function yields as a list of albums. When a key wasn't included in the list of great bands, the condition raises an error, as we only defined the happy path functionality.

We shouldn't be completely satisfied with the condition, as it already requires us it's quite a heavily indented one. Let's clean it up a little bit using the `with` operator. 

```elixir
defmodule Bands do
  def get_albums(bands, band) do
    with %{^band => band_detail} <- bands,
         %{albums: albums} <- band_detail,
         do: albums
  end
end 
```

The flat list of conditions in our function `get_albums/2` looks a lot cleaner already. The `with/1` macro takes multiple matching clauses as it's arguments, and if all the matches yield a result, it executes the `do` block.  

```elixir
iex(18)> Bands.get_albums(great_bands, :kvelertak)
[%{name: "Kvelertak", year: 2010}, %{name: "Meir", year: 2013},
 %{name: "Nattesferd"}]

iex> Bands.get_albums(great_bands, :justin_bieber)
%{bloodred_hourglass: %{albums: [%{name: "Lifebound", year: 2012},
     %{name: "Where the Oceans Burn", year: 2016}], name: "Bloodred Hourglass"},
  kvelertak: %{albums: [%{name: "Kvelertak", year: 2010},
     %{name: "Meir", year: 2013}, %{name: "Nattesferd"}], name: "Kvelertak"}}

```

Our redefined `get_albums/2` works as expected in the case of happy path, but in case of a non-match, the function now returns the parameter `bands`, which can lead to awkward situations for the caller of the function. `with/1` is defined to return the right-hand side of the first match, if the some of the match clauses fail. 

```elixir
defmodule Bands do
  def get_albums(bands, band) do
    with %{^band => band_detail} <- bands,
         %{albums: albums} <- band_detail
         do
             albums
         end
    |> case do
        ^bands -> raise "Albums not found"
        albums -> albums
       end
  end
end
```

```elixir
iex> Bands.get_albums(great_bands, :justin_bieber)
** (RuntimeError) Albums not found
    iex:41: Bands.get_albums/2
iex> 
```
In order to raise an error in case of match failure, we use the pipe operator `|>` to direct the result of the match to another `case` expression, in which we test if the result of the `with/1` block equals the the value bound to the input variable `bands` and `raise/1` an error in order to stop the execution.

From this behavior we can deduce, that using the `with/1` block comes in handy, when the matches or nested expressions run deeper than two levels. 

### Improvements to `with` in Elixir 1.3

```elixir
defmodule Bands do
  def get_albums(bands, band) do
    with %{^band => band_detail} <- bands,
         %{albums: albums} <- band_detail
      do albums
    else
        _ -> raise "Albums not found"
    end
  end
end
```

Elixir 1.3 improves in this situation by introducing an `else` block defining matchers for different error patterns. We resort to matching everything by using the underscore `_` as the left-hand side value.
