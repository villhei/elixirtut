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