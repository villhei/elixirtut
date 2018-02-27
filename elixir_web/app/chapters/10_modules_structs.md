[lambda]: img/lambda.png

<!-- TOC -->

- [Structs](#structs)
- [Module attributes and imports](#module-attributes-and-imports)
- [Mobule behaviors](#mobule-behaviors)

<!-- /TOC -->

This chapter expands on the previous chapter on Functions and Modules. We have already taken a look on how modules and their corresponding functions are defined, this chapter shows how custom types called structs and module behaviors are defined.

We also take a brief look in a feature called module attributes, which are a compile-time equivalent of constant values used in other languages.

## Structs

Most of time times programs benefit from data types with predictable shapes. Elixir being a dynamically typed language uses specialized instances of the `Map` type for user-defined data structures. These data types are called structs.

```elixir
defmodule Person do
  defstruct [:name, :birthdate]
end
```

Structs are defined within modules using the `defstruct` macro followed by a list of atoms or a keyword list for defining the values (or map keys) within the struct. A struct inherits the name of the module as it's type name. There can only be one struct per module. Attempting to define more than one struct in a module will result in a compilation error.

```
iex> seppo = %Person{name: "Seppo Räty", birthdate: "27.4.1962"}
%Person{birthdate: "27.4.1962", name: "Seppo Räty"}
iex> matti = %Person{name: "Matti Ruohonen"}
%Person{birthdate: nil, name: "Matti Ruohonen"}
```

Creating an instance from a struct is done in similar syntax as maps are created, the difference being the type name reference in the call pattern `%<type_name>{}` . The biggest user-facing difference to plain maps is that a struct will always have all their defined keys present, even if one decides to omit them in the creation. The keys will by default have `nil` as their default value.

```elixir
defmodule Person do
  defstruct [name: "Unknown", :birthdate: "Unknown"]
end

iex> %Person{name: "Matti Ruohonen"}
%Person{birthdate: "Unknown", name: "Matti Ruohonen"}
```

When the `defstruct` macro is called with a keyword list the, the keyword atoms will be used as the keys of the struct and their values will be used as default values when their corresponding value is omitted in the struct creation.

```elixir
iex> matti = %Person{name: "Matti Ruohonen", birthdate: "8.8.1949"}
%Person{birthdate: "8.8.1949", name: "Matti Ruohonen"}
iex> is_map(matti)
true
iex> matti2 = %{} = matti
%Person{birthdate: "8.8.1949", name: "Matti Ruohonen"}
iex> matti.__struct__
Person
iex> matti2 = %Person{} = matti
%Person{birthdate: "8.8.1949", name: "Matti Ruohonen"}
```

The structs behave mostly like plain maps and will pass the `is_map/1` test and will pass a check against pattern match for the map. The struct is actually a plain map holding a special key `__struct__`, which points to the type name saved in the internal table of atoms.

Because the struct definition carries the special `__struct__` key, the syntax for an empty struct can be used as a match guard when performing pattern matching. This ensures that only a given type of struct is matched.

```elixir
iex> matti.name
"Matti Ruohonen"
iex> matti[:name]
** (UndefinedFunctionError) function Person.fetch/2 is undefined (Person does not implement the Access behaviour)
    Person.fetch(%Person{birthdate: "8.8.1949", name: "Matti Ruohonen"}, :name)
    (elixir) lib/access.ex:308: Access.get/3
```

One major difference between structs and maps is that the structs do not allow to use the `[:atom]` access syntax, as they do not implement any of the protocols used by the map type. Accessing a struct with the `struct.keyname` syntax will work just fine.

```elixir
defmodule Person do
  defstruct name: nil, birthdate: "Unknown"
end

iex> matti = %Person{}
** (ArgumentError) the following keys must also be given when building struct Person: [:name]
    expanding struct: Person.__struct__/1
    iex:114: (file)
```

The module containing the struct can define a special attribute `@enforce_keys` in order to prevent a struct from being created without a critical key. Trying to define a struct without an required key will result in an error. More about attributes in the next sub chapter.

```elixir
defmodule Person do
  defstruct name: nil, birthdate: "Unknown"
end
```

When using a keyword list for values, the Elixir syntax allows one to omit the brackets `[]` from the list, and the `defstruct` macro will treat the keyworded arguments as a keyword list.

<div class="key-concept">
![Key concept][lambda]<span>Decoupling of program logic and data</span>
<p>Elixir and many other functional programming languages enforce the decoupling of program logic and data. In other words, data structures are defined separately from functions used to manipulate them. This is very evidently visible when working with structs. </p>

<p>Object-oriented programming languages such as Java in contrast introduce a concept called object methods or instance methods, which are methods that are bound the instance of an object that is currently being called. When called, these methods mutate or refer to the object instance they are bound to.</p>

<p>In functional programming languages it is a common practice to define a set of functions in a module to operate and manipulate a given data type. These functions are stateless and accept the data as a parameter and instead of mutating the data, they return a new instance of the data as their return value.</p>
</div>

Let's compare the approach to data types in Java and Elixir briefly by expanding our `Person` type to include some functionality for manipulating the data type.

```java
public class Person {
  private final String name;
  private final Date birthdate;

  public Person(String name, Date birthdate) {
    this.name = name;
    this.birthdate = birthdate;
  }

  public String getName() {
    return this.name;
  }

  public String setName(name: String) {
    this.name = name;
  }
}
```

Class definitions in object-oriented languages typically use the getter/setter pattern for manipulating private properties within a class. The properties of a class are not typically publicly accessible and thus for example a name of a person object is accessed with it's instance methods like `person.getName()`.

By well established convention, when calling a setter-method of an instance, like `person.setName("Some new name")`, the method will mutate the private properties of the associated object, as in mutate the object itself.

```elixir
defmodule Person do
  defstruct [:name, :birthdate]

  def new(name, %Date{} = birthdate) do
    %Person{name: name, birthdate: birthdate}
  end

  def get_name(%Person{} = person) do
    person.name
  end

  def set_name(%Person{} = person, name) do
    %Person{person | name: name}
  end
end
```

An equivalent Elixir module for the `Person` has similarly named functions with a few major differences. First noteworthy difference is that the `get_name/1` function is not bound to any instance of data, it takes the person for the name extraction as it's parameter. The setter function `set_name/2` also requires the data as a parameter along with the new name and it returns a new instance of the `Person` struct with modified contents.

It's a common practice in Elixir for functions to take the "most significant" parameter first followed by other parameters required for the function logic. This practice enables the chaining of functions with the pipe `|>` syntax, which has some obvious benefits as shown in previous chapters.

Notice that all the functions in the module introduce a guard to ensure that only the calls with a `Person` type are valid.

Constructor functions for structs are not mandatory, but it's good practice to provide a factory function called `new/n` where n is the count of parameters required to create an instance of the type. It's beneficial to provide the factory function as an interface for working with the data type, as the interface might remain the same, even though your representation of data might change.

```elixir
defmodule Person do
  # Unchanged from previous example
  # ...
  def format(%Person{} = person) do
    "The person is #{person.name}, born #{Date.to_string(person.birthdate)}"
  end
end

iex> {:ok, date} = Date.new(1949, 8, 8)
iex> Person.new("Matti Ruohonen", date)
...> |> Person.set_name("Teppo Ruohonen")
...> |> Person.format
...> |> IO.puts
The person is Teppo Ruohonen, born 1949-08-08
:ok
```

When your modules grow to the point where they provide some meaning functionality, the benefits of the convetion of having the first parameter point to the input data become more evident.

The immutability of data in functional programming languages makes testing this functionality relatively trivial, but comes with the expense of creating new instances of data, which will increase memory consumption and impact your application's runtime performance.

## Module attributes and imports


## Mobule behaviors