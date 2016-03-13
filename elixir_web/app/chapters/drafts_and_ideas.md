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