<!-- TOC -->

- [Supervisors](#supervisors)
  - [Genserver](#genserver)
  - [Task](#task)
  - [Agent](#agent)

<!-- /TOC -->

Elixir offers several abstractions around processes. The abstractions provide an easy-to-use interface to the `spawn/1` and `spawn/2` functions. The `genserver` module provides a protocol for creating client-server behaviors. `Task` module provides the behavior typically associated with worker-style threads. `Agent` provides a protocol to implement stateful processes, which are basically modelled as finite state machines.

Before getting familiar with these modules, we first need to take a look at the concept of supervisor, which is used to manage the lifecycle of processes.

## Supervisors

  - Before diving too deep to the abstractions around processes, we need to take a look at supervisors to make spawning processes somehow sensible
  - Supervisor needed to run an application

### Genserver

  - Use some examples of client-server communication, maybe a chatroom?

### Task

  - Perform some long running task, return results

### Agent

  - Figure out a good way to abstract state