# <a name="building_applications"> Building applications

## <a name="building_applications"></a>Throwing a project into the mix
Elixir uses the `mix` application to build and manage projects. In this chapter we wiill familiarize ourselves with the use of `mix`.

```bash
$ mix new example_project --module ExampleProject
```

We create a project `example_project` by calling `mix new`. The `--module` parameter specifies which module to use as an entry point in the application. The module name defaults to the project name, but we choose to use a CamelCased variant for it.

```bash
* creating README.md
* creating .gitignore
* creating mix.exs
* creating config
* creating config/config.exs
* creating lib
* creating lib/example.ex
* creating test
* creating test/test_helper.exs
* creating test/example_test.exs

Your Mix project was created successfully.
You can use "mix" to compile it, test it, and more:

    cd example
    mix test

Run "mix help" for more commands.
```
Mix will now create the project structure and some helper files you typically would need to create anyway. 

##### mix.exs 
The file `mix.exs` is reponsible for managing your project's dependencies, version information and it's execution environment and top-level configuration.

##### config 
The folder is used to store the project's configuration file `config.exs`, in which you manage configuration of your application and it's dependencies. The configration contains key-value pairs.

```elixir
config :example, example_config_key: :configuration_value
```

The config can be accessed with the `Application._get.env/2` function during runtime. 

##### lib
This folder is used to store the application source code. Mix automatically creates a placeholder file used with the module `Example` defined. The files in the `lib` folder are targets of compilation, and use the `.ex` extension by convention.

##### test
Elixir applications use the [ExUnit](http://elixir-lang.org/docs/stable/ex_unit/ExUnit.html) test framework for unit tests. An example of test is also provided. Notice that the tests use `.exs` for their extension, as the tests do not need to be compiled in order to be useful.

```bash
$ mix compile
Compiled lib/example.ex
Generated example app
Consolidated List.Chars
Consolidated String.Chars
Consolidated Collectable
Consolidated Enumerable
Consolidated IEx.Info
Consolidated Inspect
```
The project is compiled with the `mix compile` command. The compiler will output BEAM bytecode to the `_build` directory.

```bash
$ iex -S mix
```

Once the project has been compiled, you can start the `iex` REPL within the project and access all the project's and modules functions

```bash
$ mix test
Compiled lib/example.ex
Generated example app
Consolidated Collectable
Consolidated List.Chars
Consolidated String.Chars
Consolidated Enumerable
Consolidated IEx.Info
Consolidated Inspect
.

Finished in 0.04 seconds (0.04s on load, 0.00s on tests)
1 test, 0 failures

Randomized with seed 458385
```

Tests can be ran by running the `mix test` command. You can also supply that file name of a particular test suite in order to limit the amount of tests ran. This is very useful when the test suites grow large and you want to your focus on a single feature.