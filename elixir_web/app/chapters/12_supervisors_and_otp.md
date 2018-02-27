<!-- TOC -->

- [Supervisors](#supervisors)
  - [Genserver](#genserver)
  - [Task](#task)
  - [Agent](#agent)

<!-- /TOC -->

Elixir standard library offers several abstractions around processes. These abstractions provide an easy-to-use interface to the `send` `spawn` and `receive` functions. The `genserver` module provides a protocol for creating client-server behaviors. `Task` module provides the behavior typically associated with worker-style threads. `Agent` provides a protocol to implement stateful processes, which are basically modelled as finite state machines.

Before getting familiar with these modules, we first need to take a look at the concept of supervisor provided by the OTP (Open Telecom Platform). OTP is effectively the standard library of Elixir and Erlang, and the compiler and virtual machine distributions for the languages are often referred to as Erlang/OTP or Elixir/OTP.

## Supervisors

A supervisor defines convenience functions are an process abstraction for managing the lifecycle of other OTP process modules and supervisors. Supervisors are often used to build static supervision trees, which in turn represent an application. A supervisor is often the immediate entry point to an application.

```
defmodule App.Supervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, :ok, opts)
  end

  def init(:ok) do
    children = [
      App.ChildModule
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
```

  - Before diving too deep to the abstractions around processes, we need to take a look at supervisors to make spawning processes somehow sensible
  - Supervisor needed to run an application

### Genserver

  - Use some examples of client-server communication, maybe a chatroom?

### Task

  - Perform some long running task, return results

### Agent

  - Figure out a good way to abstract state