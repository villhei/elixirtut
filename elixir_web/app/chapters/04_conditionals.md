<div class="warning">
<span>TODOS</span>
  <ul>
    <li>Guards could be more exhaustive</li>
  </ul>
</div>

[lambda]: img/lambda.png
Elixir supports `if` ... `else`, `unless`, `cond` and `case` structures for controlling the flow of an application. The `if` ... `else` structures work much like in other languages. `unless` is syntactic sugar for negation of an `if` condition. `case` is used to match patterns extracted from variables or values, `cond` is used for complex chains of `if` ... `else` conditions.

## <a name="conditions_if_else"></a>If .. else

```elixir
iex> if true do
...>   "was true"
...> else
...>   "wasn't true"
...> end
"was true"
```

The `if/2` macro accepts a condition (remember: only `nil` and `false` atoms evaluate to `false`) and a keyworded list of clauses for `do` in case of a truthful condition, and `else` in the case of a falsy or `nil` condition. The `if/2` is usually called using the syntax above.

```elixir
iex> if(1, [do: true, else: false])
true
iex> if(1, do: true, else: false)
true
```

The behavior of the `if/2` macro and it's keyword-list parameters is demonstrated with the example above. The condition is truthful, so the  which evaluates to true. The macro has two clauses, the `do:` block for a truthful condition and the `else:` block for a falsy condition. This syntax is rarely used, but is demonstrated here for better understanding of the implementation of the `if/2` macro.

```elixir 
iex> iex(7)> if(false, do: "hello")
nil
```

In case of a missing `else:`  block or keyword, the `if/2` evaluates to false.

```elixir
iex> hello = "world"
"world"
iex> if(false, do: hello = "true", else: hello = "false")
"false"
iex> hello
"false"

```

![Warning][warning] It turns out that the macro implementation of the `if/2` has a slight gotcha! It's good to bear in mind that the `do:` or `else:` keyworded blocks are bound to their outer scopes, which unfortunately can be side-effecting as demonstrated above.

```elixir
iex> hello = if(false, do: "true", else: "false")        
"false"
```

In order to keep your intentions explicit and for good functional programming practice, the side-effecting pattern should be avoided in favor of the latter. Clearly show your intention to bind the return value to a variable.

## <a name="conditions_cond"></a>Cond

```elixir
iex> name = "hello"
"hello"
iex> cond do
       name == "world" ->
        "it's not"
       name == "hello" ->
        "well #{name}!"
       name == "something else" ->
        "highly unlikely"
      end
"well hello!"

```

The `cond` turns out useful when the expressive power of `if` .. `else` runs out. The additional conditions listed in the `cond` construct behave much like `else if` statements in imperative languages such as Java. `cond` is relatively rarely used in Elixir, because most of the time `cond` can be substituted with the `case` construct that leans towards the functional style.

```elixir
iex> name = "hello"
"hello"
iex> cond do
       name == "world" ->
        "it's not"
       name == "I WILL NOT MATCH" ->
        "well #{name}!"
       name == "something else" ->
        "highly unlikely"
      end
** (CondClauseError) no cond clause evaluated to a true value

```

The `cond` construct will raise an error if it does not find a suitable condition to fulfill. 

```elixir
iex> name = "hello"
"hello"
iex> cond do
       name == "world" ->
        "it's not"
       name == "I WILL NOT MATCH" ->
        "well #{name}!"
       name == "something else" ->
        "highly unlikely"
       true ->
        "Atoms to the rescue!"
      end
"Atoms to the rescue!"
```

The last condition of a `cond` construct can be substituted with the atom `true` in order to prevent an exception from raising. The `true` will obviously always be truthful and by this addition we're making sure there is a fallback mechanism, for example in the case of unexpected values or a programmer error.

## <a name="conditions_case"></a>Case

The `case` construct is perharps the most interesting of the conditional constructs. The `case` construct allows the programmer to use the full power of pattern matching in combination with guard clauses.

```elixir
iex> case {1, 2, 3} do
        {4, 5, 6} -> "Will not match"
        {1, 2, 3} -> "Will match"
        {2, 3, 4} -> "Will not match"
     end
"Will match"
```

The patterns in the `cond` clause will be evaluated from top to bottom, and the first clause to match will return the associated expression.

```elixir
iex> case {1, 2, 3} do
        {4, 5, 6} -> "Will not match"
        {1, 2, 4} -> "Will not match"
        {2, 3, 4} -> "Will not match"
     end
** (CaseClauseError) no case clause matching: {1, 2, 3}
```

An error will be raised if none of the clauses match, just like with `cond` and `if` .. `else` constructs.

```elixir
iex> case {1, 2, 3} do
        {4, 5, 6} -> "Will not match"
        {1, 2, 4} -> "Will not match"
        {2, 3, 4} -> "Will not match"
        _         -> "Will always match"
     end
"Will always match"
```

The `_` clause has a special meaning in Elixir. The underscore `_` means "any value" or "anything" or "ignore the value" and will always yield true in `cond` constructs. 


```elixir
iex> case {1, 2, 3} do
        {_, y, 4} -> "Will not match"
        {x, 2, _} -> "Will match"
        {2, _, _} -> "Will not match"
        _         -> "Will not match"
     end
"Will match"
```

The clauses listed in the `case` construct need not be exhaustive. The clauses can be a combination of bound variables or they can be ignored. The second clause in addition to the last one is the only one that has a properly matching pattern.

## <a name="conditions_case"></a>A case of guards

```elixir
iex> case {1, 2, 3} do
        {x, y, z} when x + y + z == 7 -> "Will not match"
        {x, y, z} when x + y + z == 6 -> "Will match"
        {x, y, z} when x + y + z == 8 -> "Will not match"
     end
"Will match"
```

The `cond` constructs can also be complemented with *guard* conditions that represent a condition that must me fulfilled in addition for the pattern matching to produce valid results. In the example above we extract the values of the input `{1, 2, 3}` to variables in the tuple `{x, y, z}` and test a simple arithmetic expression against an integer value. 1 + 2 + 3 is equal to 6, so the middle condition is the only one to yield true.

Note that all comparison operators (ie. `<`, `>`, `<=` or `>=`) can be used as a part of a guard condition. Also the type checking functions such as `is_atom/1` are valid guard clauses. Full list of valid clauses can be found from the official [Elixir tutorial](http://elixir-lang.org/getting-started/case-cond-and-if.html).

Also noteworthy that instead of the type-agnostic `||` and `&&` operators only the boolean operators `and` and `or` can be used as a part of a guard condition.

```elixir
iex> case :dog do
       x when x in [:cat, :dog, :cow] -> "Will match"
       _ -> "Will not match"
     end
"Will match"
```

The guard condition guarding the clause can also be used to match multiple items in the same time using the `in` operator, which looks for the input value in a `list` or `range`. Unfortunately because of the `in`'s macro implementation and dynamic typing of Elixir, the `in` cannot reference a variable as it's right-hand side.

```elixir
iex> case 666 do
       x when x in 1..500 -> "Won't match"
       x when x in 501..1000 -> "Will match"
       _ -> "No match"
     end
"Will match"
```

The guard condition can also match against ranges, which can prove itself useful with it's elegant short-hand syntax.

## <a name="pin_operator"></a>The pin operator

As Elixir allows variables existing in a given scope to be rebound, the conditional statements can sometimes be a little risky and yield unpredictable results. The allow matching against the values bound to variables, Elixir provides an operator `^`, commonly referred to as the pin operator.

```elixir
iex> name = "Seppo"
"Seppo"
iex> ^name = "Seppo"
"Seppo"
iex> ^name = "Turo"
** (MatchError) no match of right hand side value: "Turo"
```

When the pin operator `^` is prepended to a variable, it causes the match `=` operator along with the clauses of `if`, `cond` and `case` operators to match against the value bound to the variable.

The match will, like usual, raise an error if no match in clause was found.

```elixir
iex> y = 4
iex> {x, ^y} = {2, 4}
{2, 4}
iex> x
2
```

The pin operator plays nicely with all sorts of matching conditions, including matching against partial tuples.

```elixir
iex> {x, ^y} = {2, 1}
** (MatchError) no match of right hand side value: {2, 1}
```

As like with other match patterns, the usual errors are raised also for partial matches.

```elixir
iex> _ = [1, 2, 3]
[1, 2, 3]
iex> _
** (CompileError) iex:11: unbound variable _
```

Elixir also provides a special match condition with the underscore symbol `_`. The underscore reads: "Match against whatever value and ignore the results." The condition will always yield a match but the underscore is always unbound and the right-hand side of the match is discarded.

The underscore is syntactic sugar to allow the programmer easily produce an exhaustive match condition and to be explicit about the intention to ignore a value.