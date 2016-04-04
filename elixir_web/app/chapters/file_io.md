- Will include Streams for resources
- Basic File IO with lots of unix references

Most of the times programs need to interact with the surrounding world in order to produce useful results. 

The basic IO functions are provided by the [IO module](http://elixir-lang.org/docs/stable/elixir/IO.html). We have already played around with the function `IO.puts/1` in order to produce some output from our code snippets. 

The functions provided by the `IO` module in fact take use of named IO processes running on the BEAM virtual machine. These processes include `:stdio` for the standard io stream and `:stderr` for the standard error stream.

These processes are called IO devices in the BEAM. The IO processes, including file processes, are positional. Positionality means that a successive read or write to or from the stream will continue from where the previous call finished.

## The IO module

```elixir
iex> IO.puts("All your output are belong to IO processes")
All your output are belong to IO processes
:ok
```

The `IO` module allows for for printing and reading values to and from the `:stdio` input stream. Printing text in Elixir is very easy compared to languages such as haskell, as the return value `:ok` from the *side-effecting* `IO.puts/1` function can effectively be ignored.

The `IO.puts/1` is a side-effecting function, as from the programmers perspective the manipulation of the standard output stream is not very measurable, although it yields the `:ok` as a result. Were you to change the parameters to some other string, you would still get the result `:ok` but the resulting side-effect of printing wouldn't be equivalent.

```elixir
iex> IO.puts(:stderr, "I am an error message!")
I am an error message!
:ok
```

The `IO.puts/2` accepts an additional parameter specifying the desired output stream, which in this case is set with the `:stderr` atom, in order to direct the output to the standard error stream.

```elixir
iex> IO.gets("Give me a yes or a no? yes/no \n")
Give me a yes or a no? yes/no 
yes
"yes\n"
```

The `IO.gets/1` function is used to read user input from the `:stdio`process, in addition to command-line arguments this is probably the easiest way to implement some sort of interaction in your Elixir application. 

```elixir
iex> IO.gets("Give me a yes or a no? yes/no \n") |> String.replace("\n", "")
Give me a yes or a no? yes/no 
yes
"yes"
```

Notice that the `IO.gets/1` also feeds you the newline character `\n`, you can get rid of it easily by using the `String.replace/2` function in succession.

```elixir
iex> name = "Donna Summers"
iex> IO.puts(name)
Donna summers
:ok
iex> IO.puts("The greatest performer of all time is #{name}")
The greatest performer of all time is Donna summers
:ok
iex> IO.puts("1 + 1 = #{1 + 1}")
1 + 1 = 2

```

The `IO.puts/1` can also accept a variable as it's parameter, if the variable can be recognized as `chardata`. Elixir also supports a nice thing called string interpolation. The string interpolation allows us to write an expression within the string with the syntax `#{expr}`. 

The interpolated string will evaluate to the result of the enclosed expression, as demonstrated in the latter example of adding 1 to 1.

```elixir
iex> dog = {"Mortti", :pyrenese_sheepdog}
{"Mortti", :pyrenese_sheepdog}
iex> IO.puts("#{dog}")
** (Protocol.UndefinedError) protocol String.Chars not implemented for {"Mortti", :pyrenese_sheepdog}
    (elixir) lib/string/chars.ex:3: String.Chars.impl_for!/1
    (elixir) lib/string/chars.ex:17: String.Chars.to_string/1
```

Often when trying to do dumb debug output from applications we face the error of `String.Chars` protocol not being implemented on the type we are working with. For this, Elixir provides the [Inspect](http://elixir-lang.org/docs/stable/elixir/Inspect.html) protocol.

``` elixir
iex> inspect(dog)
"{\"Mortti\", :pyrenese_sheepdog}"
iex> IO.puts("#{inspect(dog)}")
{"Mortti", :pyrenese_sheepdog}
:ok
```

For formatted output of built-in types, the Elixir [Kernel module](http://elixir-lang.org/docs/stable/elixir/Kernel.html) provides a convenient function `inspect/1`. The function `inspect/1` is used to call the `inspect` callback defined for that particular data structure or type. The definition of the `inspect/2` callback is responsible for the string representation of that particular data structure. 

The `inspect` function is a handy utility for debugging, and the values printed by the the `iex` interpreter are results of inspection.

```elixir
iex> IO.inspect(dog)
{"Mortti", :pyrenese_sheepdog}
{"Mortti", :pyrenese_sheepdog}
```

The IO module also provides a function `IO.inspect/1` for printing the inspection result of a given data structure to the `:stdio` output. `IO.inspect/1` is a useful debug function.

The rest of the functions defined by the [IO module](http://elixir-lang.org/docs/stable/elixir/IO.html) can be found from the official documentation.

## The File module

The [File](http://elixir-lang.org/docs/stable/elixir/File.html) module provides a set of functions that enable both read and write access to files and some convenience functions such as for manipulation of files.

Most of the functions are named conveniently after their UNIX counterparts so it's quite easy to guess what `File.ls/1` is going to do.

<table class="table">
  <thead>
    <tr>
      <td>
        Name
      </td>
      <td>
        Unix equivalent
      </td>
      <td>
        Description
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        `File.ls(path)/1`
      </td>
      <td>
        ls [path]
      </td>
      <td>
        Lists the contents of a directory.<br>
        `File.ls("/home/ville")`
      </td>
    </tr>
    <tr>
      <td>
        `File.cp(path, to_path)/3`
      </td>
      <td>
        cp [path] [to_path]
      </td>
      <td>
        Copies the contents in the source to destination. Accepts an optional callback as a third argument.<br>
        `File.cp("file.txt", "to_file.txt")`
      </td>
    </tr>
    <tr>
      <td>
        `File.cp_r(path, to_path)/3`
      </td>
      <td>
        cp [path] [to_path]
      </td>
      <td>
        Copies the contents in the source to destination. Accepts an optional callback as a third argument.<br>
        `File.cp_r("source_dir", "destination_dir")`
      </td>
    </tr>
    <tr>
      <td>
        `File.rm/1(file)`
      </td>
      <td>
        rm [file]
      </td>
      <td>
        Removes a file.<br>
        `File.rm("temp.txt")`
      </td>
    </tr>
    <tr>
      <td>
        `File.rm_rf(path)/1`
      </td>
      <td>
        rm -rf [path]
      </td>
      <td>
        Recursively removes the files and directories of a path, ignoring write-protection. Does not follow symbolic links.<br>
        `File.rm_rf("dir_to_delete")`
      </td>
    </tr>
    <tr>
      <td>
        `File.rename(file, new_file)/2`
      </td>
      <td>
        mv [file] [new_file]
      </td>
      <td>
        Moves or renames a path.<br>
        `File.rename("old_path_name", "new_path_name")`
      </td>
    </tr>
    <tr>
      <td>
        `File.mkdir/1`
      </td>
      <td>
        mkdir [path]
      </td>
      <td>
        Creates a new directory.<br>
        `File.mkdir("dir_name")`
      </td>
    </tr>
    <tr>
      <td>
        `File.chown(path, uid)/2`
      </td>
      <td>
        chown [uid] [path]
      </td>
      <td>
        Changes the owner of a file to given UID.<br>
        `File.chown("some_file", 1000)`
      </td>
    </tr>
  </tbody>
</table>

The `File` module provides a good coverage of abstractions for UNIX file system operations. Thus working with the `File` module should feel intuitive to most of us.

Let's look at some of these functions and their usage in a bit more detail, to give a general idea on how to work with the filesystem in Elixir. As we will soon find out, it is very easy.

```elixir
iex> File.ls("/home/ville/shopping_lists") 
{:ok, ["ikea.txt", "groceries.txt"]}
```

The `File.ls/1` function returns a tuple with `{:status, results}`, where the results is a list of of files in the directory given as a parameter.

```elixir
iex> File.ls("./not_accessible")
{:error, :eacces}
iex> File.ls("does_not_exist")
{:error, :enoent}
```

If the `File.ls/1` fails to perform it's task, it will output a tuple  `{:error, :error_code}` where the error code is the actual error that occured. 

```elixir
iex> File.ls!(".")             
["ikea.txt", "groceries.txt"]
iex> File.ls!("does_not_exist")
** (File.Error) could not list directory does_not_exist: no such file or directory
    (elixir) lib/file.ex:1167: File.ls!/1
```

The `File` module provides an error-raising variant for the functions. The error raising variant can be recognized by the trailing bang `!` character. In the example above, we call the `File.ls/1` function that returns the list of results instead of a tuple.

The error-raising variants are quite a nice thing, as they allow the programmer to inspect the result instead of doing pattern matching with status codes. Obviously your current process will also crash, but hey! We don't really want to recover from every erroneous situation anyway.

You should use the regular version whenever you expect the need to handle the error scenarios and use the `!` banged variant whenever you consider a fast fail a better option.

```elixir
iex> File.read("ikea.txt")
{:ok, "Table\nSofa\nMattress\nDrawer\n"}
iex> File.read!("ikea.txt")
"Table\nSofa\nMattress\nDrawer\n"
```

Reading the contents of a file is handled by the `File.read/1` and `File.read!/1` functions. Reading a file simply returns the binary content of the file.

```elixir
iex> ikea_stream = File.stream!("ikea.txt")
%File.Stream{line_or_bytes: :line, modes: [:raw, :read_ahead, :binary],
 path: "ikea.txt", raw: true}
iex> ikea_stream |> Stream.map(fn s -> String.upcase(s) end) |> Enum.to_list
["TABLE\n", "SOFA\n", "MATTRESS\n", "DRAWER\n"]
```

The file can also be opened as a stream with the `File.stream!` function. The returned stream by default chunks the file in to lines, and the resulting lines can be manipulated in the usual manner with functions from the `Stream` and `Enum` modules.

```elixir
iex> {:ok, file} = File.open("new_file.txt", [:write, :utf8])
{:ok, #PID<0.84.0>}
iex> IO.write(file, "Serious content!\n")                    
:ok
iex> IO.write(file, "Hästerna springer på sommaren!")        
:ok
iex> File.close(file)                                        
:ok
```

In order to write textual content to a file, we first open new process for the file by calling `File.open/2`. The `File.open/2` accepts the file name as a first parameter and an optional list of options as the second parameter. We pass the atoms `:write` and `:utf8` in order to handle unicode content properly.

Then we use `IO.write/2` function to write a string to the file. Because of the positional nature of the `File` and `IO` operations, the second sentence will be appended after the first.

Finally we call `File.close/1` with the file process identifier in order to release the file.

```elixir
iex> File.read!("new_file.txt")
"Serious content!\nHästerna springer på sommaren!
```

By taking a look at the file with `File.read!`, the contents seem to be in place. What if we want to read the file line by line?

```elixir
iex> {:ok, file} = File.open("new_file.txt", [:utf8])        
{:ok, #PID<0.89.0>}
iex> IO.read(file, :line)                                    
"Serious content!\n"
iex> IO.read(file, :line)
"Hästerna springer på sommaren!"
iex> IO.read(file, :line)
:eof
iex> File.close(file)
:ok
```

First we open the file again with a call to `File.open/2`, but this time we don't pass the `:write` atom. Then we use the `IO.read/2` function to read the file line by line. The `IO.read/2` will return the atom `:eof` when the read reaches the end of the file.

The `IO.read/2` can also be used to read the file at once by passing the `:all` atom as a parameter. By passing a non-negative integer, you obtain the requested amout of characters.

```elixir
iex> File.ls!(".")
["new_file.txt", "ikea.txt", "groceries.txt"]
iex> File.rm("new_file.txt")
:ok
iex> File.rm("new_file.txt")
{:error, :enoent}
```

Removal of files can be done using the `File.rm/1` function, that accepts a file name as a parameter. The banged variant `File.rm!/1` works veri similarily, as it either returns an `:ok` or raises an exception. The `File` module provides a few more functions for removals.