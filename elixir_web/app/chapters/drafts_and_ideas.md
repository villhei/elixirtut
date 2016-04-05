## <a name="reactive_applications"> Reactive applications

    - Have to use phoenix for examples, it's a little too heavyweight for exercises
    - Phoenix has WebSocket channels that can handle communication between subscribers
    - Phoenix fails to run if Node < 4.0 or NPM < 3.0

## Potential chapters

  * Construction of modules, module attributes
  * Comprehensions
  * Typespecs
  * Protocols and behaviours
  * Sigils
  * Try, catch, rescue
  * Distributed computing

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


### Bitstrings are fucking awesome

```elixir
iex> tcp = <<0b11001010, 0b11100010, 0b00000000, 0b01010000, 0b01000010, 0b11110001>>
<<202, 226, 0, 80, 66, 241>>

```


```
TCP/IP Packet Example:

7E 21 45 00 00 4B 57 49 40 00 FA 06 85 77 C7 B6 78 0E CE D6 95 50 00 6E 04 9F 74 5B EE A2 
59 9A 00 0E 50 18 24 00 E3 2A 00 00 2B 4F 4B 20 50 61 73 73 77 6F 72 64 20 72 65 71 75 69 
72 65 64 20 66 6F 72 20 61 6C 65 78 75 72 2E 0D 0A 67 B2 7E

Start   7E
SEP   21
IP Header 45 00 00 4B 57 49 40 00 FA 06 85 77 C7 B6 78 0E CE D6 95 50 
TCP Header  00 6E 04 9F 74 5B EE A2 59 9A 00 0E 50 18 24 00 E3 2A 00 00  
Data    2B 4F 4B 20 50 61 73 73 77 6F 72 64 20 72 65 71 75 69 72 65 64 20 66 6F 72 
    20 61 6C 65 78 75 72 2E 0D 0A 
FCS   67 B2
Stop    7E

TCP Header:
SRC_PORT=110  DEST_PORT=1183   SEQ=0x745BEEA2  ACK=0x599A000E   DTO=0x5  FLG=0x18  WIND=0x9216  
TCP_SUM=0xE32A  URP=0000   (No Options)
```

```
iex> tcp = <<0x7E, 0x21, 0x45, 0x00, 0x00, 0x4B, 0x57, 0x49, 0x40, 0x00, 0xFA, 0x06, 0x85, 0x77, 0xC7, 0xB6, 0x78, 0x0E, 0xCE, 0xD6, 0x95, 0x50, 0x00, 0x6E, 0x04, 0x9F, 0x74, 0x5B, 0xEE, 0xA2, 0x59, 0x9A, 0x00, 0x0E, 0x50, 0x18, 0x24, 0x00, 0xE3, 0x2A, 0x00, 0x00, 0x2B, 0x4F, 0x4B, 0x20, 0x50, 0x61, 0x73, 0x73, 0x77, 0x6F, 0x72, 0x64, 0x20, 0x72, 0x65, 0x71, 0x75, 0x69, 0x72, 0x65, 0x64, 0x20, 0x66, 0x6F, 0x72, 0x20, 0x61, 0x6C, 0x65, 0x78, 0x75, 0x72, 0x2E, 0x0D, 0x0A, 0x67, 0xB2, 0x7E>>

iex> << _ :: binary-size(22), 
     src_port :: 16, # 16 bits, base10 integer
     dest_port :: 16, # 16 bits
     seq :: 32, # 32 bits
     ack :: 32,
     dto :: 4,
     _ :: 6, # Ignore reserved bytes 
     flags :: 6, 
     window :: 16,
     checksum :: 16,
     urgent:: 16,
     options:: 24,
     padding :: 8,
     data :: binary >> = tcp # Accept the data as binary

iex> {src_port, dest_port, seq, ack, dto, flags, window, checksum, urgent, options, padding}   
{110, 1183, 1952181922, 1503264782, 5, 24, 9216, 58154, 0, 2838347, 32}


```