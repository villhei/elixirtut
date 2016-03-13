[lambda]: img/lambda.png

<div class="quote"><p>Processes are a part of the language - they do not belong to the operating system. That's really what's wrong in languages such as Java or C++ that, threads are not in the language, they are something that's in the operating system. They inherit all the problems they have in the the operating system.</p>
    <span class="quotee">-Joe Armstrong, The principal inventor of Erlang</span>
</div>
## Introduction to processes

Elixir inherits the concept of processes from the Erlang Virtual Machine BEAM. In Elixir all code runs within processes, which area extremely light-weight abstractions over threads. Internally BEAM creates a set of kernel-level threads and schedules the light weight threads (processes) between the more heavy-weight lower level threads. The amount of kernel level threads usually equals the amount of available CPU cores.

Process creation in Elixir and on the BEAM is really cheap in comparison to other programming languages such as Java or C#. The traditional approach is to create a new thread at the operating system level, which comes at the relatively high cost of context switching and memory use in comparison to the approach selected for BEAM.

As a result, it is no way uncommon for a typical Elixir or Erlang application to coordinate hundreds, thousands or even tens of thousands of processes on a single machine. Impressive, tempting, exciting!

Being a functional language, Elixir also doesn't face the problem of state corruption, which is a typical problem in concurrent programming using imperative languages. Because a mutable state does not exist, data does not need to be protected from writes with constructs such as locks, mutexes or semaphores.

More info, motivation: http://www.infoq.com/presentations/erlang-software-for-a-concurrent-world

There are two possible approaches to concurrency, the shared memory model, where processes lock the data for the duration needed to access it and the message passing model selected for use in BEAM.

**The problems of shared memory model**
  - A thread crashes while doing a write in a shared region of memory making the memory corrupted and thus inaccessible for other threads
  - High latency for accessing the shared region of memory

To be able to utilize these features provided by BEAM, we are going to take a look at the concept of processes in Elixir.

**The message passing approach selected by the BEAM and Elixir**
  - No sharing of data
  - Pure message passing
  - No locks
  - Lots of computers (let one crash)
  - Functional programming (avoid side effects)

## <a name="actors"></a> Some formalism with actors

Defined more formally, the independent processing units (processes) in Elixir and the BEAM follow the definition of an [Actor](https://en.wikipedia.org/wiki/Actor_model). Actor is a concept introduced by Carl Hewitt in 1973 as an alternative to the object-oriented approach for stucturing of programs. 

The actor model has been called the "20000 year old design pattern". A program composing of multiple different types of individual actors very much resembles the way humans interact with each other in order to perfrom a collaborative task - hence the name actors.

The actor model has recently gained a lot of interest because it happens to fit the concurrent programming model really well. A process in Elixir is basically an actor, and thus actor is an independent parallel unit of computation.

The definition of an model
  * An actor is a fundamental unit of computation with processing, storage and communication
  * An actor can send and receive messages
  * An actor has a mailbox
  * Everything is an actor

The behavior of an actor is defined by the axioms
  * An actor can create new actors
  * An actor can send messages to other actors it knows of
  * An actor can designate how to handle the next message it receives

Let's look at these fundamental rules in a bit more detail by using a scenario example of distributing a CPU-heavy parallelizable task to a set of actors. 

Let's imagine our actor is modelled as a a state-machine. We first create an actor that specializes in some cpu-bound task. The actor initially starts from a state, where the actor is configured to receive these CPU-heavy tasks of ours.

### An actor can create new actors

The actor `parent` receives our initiating message `{:do_something_expensive, sender, dataset}`. Upon receiving the message, the `parent`actor is programmed to create new actors, called `workers` that are effectively it's children.

### An actor can send messages to other actors

When the actor has created it's `workers`, the actor chunks the dataset it received and sends the chunks it to it's `workers` by with the message `{:do_calculations, chunk}`.

The `workers` receive the message and start doing the calculation, which can of course,be split to even smaller chunks and distributed to new `workers` recursively.

### An actor can designate how to handle the next message it receives

Initially, when our `parent` sends out the message to the `workers`, it changes the state from the initial state where it was ready to receive tasks, to a state where it's waiting for results from it's `workers`. 

When the `workers` finish the processing they were designated to do, they send back a message to their `parent` with the results of the tasks and choose to terminate themselves.

When the `parent` receives the first results back from a `worker` the parent transitions to (stays in) the receiving state. When the last `worker` sends the results of the task to the `parent`, the `parent` send a message to the initiater of the task and transitions back to the initial state.

## Spawning processes

It turns out we have been working inside a BEAM process this whole time! That means, the thread we are working in can be used to spawn processes. Let's confirm this fact immediately!

### The keys to the kingdom with `spawn/1`

```elixir
iex> spawn(fn -> 5 * 5 end)
#PID<0.62.0> 
```

We use the function `spawn/1` to fire away a process that does something really simple. In exchange for the anonymous function it starts working with, spawn returns us a process identifier of type `PID`, which we can use has a handle to access to process in case we want some further communication with it.

```elixir
iex> pid = spawn(fn -> 5 * 5 end)
#PID<0.80.0>
iex> Process.alive?(pid)
false
```

Assigning the process `PID` to a variable allows us to inspect the process after it has been spawned. Quite unsurprisingly, we weren't fast enough to type in the `Process.alive?/1` expression, and the process lasting just a few instructions terminated, and it's alive status yielded a `false`.

```elixir
iex> self()
#PID<0.57.0>
iex> Process.alive?(self())
true
```

Because the `iex` interactive REPL session is also a running process, we can easilly find a living process by calling the `self/0` function in order to obtain the current `PID` of the process we are working in. The `self/0` works also from within child processes.

### Accessing the mailbox with `send/2` and `receive`

The process' mailbox can be read using the `receive` expression inherited from Erlang. The process can send messages to another process using the `send/2` function that takes the target process and the message as arguments. The full documentation for `receive` and `send/2` is available in the Erlang manual's [expression chapter](http://erlang.org/doc/reference_manual/expressions.html).

```elixir
iex> send(self(), :you_have_mail)
:you_have_mail
iex> receive do
...> :you_have_mail -> "Yey! We got mail"
...> _ -> "Something unexpected"
...> end
"Yey! We got mail"
```

There is no shame in talking to your self, everybody does it sometimes. By obtaining the process handle with `self/0` we can send a message consisting of the atom `:you_have_mail`. The expression `receive` works just like conditional structure `case`. Unlike `case` `receive` does not take an explicit parameter, but it reads the next message from the mailbox. 

The message is then matched against the patterns provided for the `receive` expression and again our results are sort of predictable.

```elixir
iex> receive do
...>  :foo -> msg
...> after
...>  1_000 -> "Timeout after a second"
...> end
Timeout after a second
```

When working with the `receive` expression, you sometimes want to make sure (especially in shell sessions) that the `receive` expression doesn't block the thread forever. A timeout can be supplied in an `after` block. The timeout is given in milliseconds, which the Elixir syntax makes quite clear for us with a tendency towards dyslexia. The timeout can also be a `0` in case you are expecting to find mail from the box right away.

```
iex> parent = self()
#PID<0.57.0>
iex> spawn(fn -> send(parent, {:hey_there, self()}) end)
#PID<0.112.0>
iex> receive do
...>   res -> "Received a response #{inspect(res)}"
...> end
"Received a response {:hey_there, #PID<0.112.0>}"
```

Holy Uncanny Process! It really is this easy! We first assign the variable `parent` to point to the `iex` shell session. Then we spawn an anonymous function, which uses `send/2` to send the parent a message with the payload of the atom `:hey_there` and a reference to the sender, which is the anonymous function.

The `parent` process defines the expression received that just assigns the response to the variable `res` and interpolates the response within a string using the `inspect/2` function from the Kernel module. The result is a string informing us of a received response. 

```elixir
iex> parent = self()
#PID<0.57.0>
iex> spawn(fn -> send(parent, {:hey_there, self()}) end)
#PID<0.117.0>
iex> flush()
{:hey_there, #PID<0.117.0>}
:ok
```

In practice, especially for debugging purposes, we do not really have to write the `receive` expression every single time. The Elixir Kernel also provides the `flush/0` function that reads every message from the mailbox and calls `inspect/2` for each result.

Now that we have taken a closer look to processes, let's start building something a little more complex and return to the abstract example of `parent` and `worker`s used in the introductory section.

## Modelling a state machine

```elixir
defmodule Parent do

  def start() do
    spawn_link(fn -> ready_to_receive() end)
  end

  defp ready_to_receive() do 
    receive do
      {:do_something_expensive} ->
        IO.puts("Task received")
        ready_to_receive()
      _ -> 
        IO.puts("Can't handle this")
        ready_to_receive()
    end
  end
end
```

Let's start by defining a really simple implementation for the behavior of `parent` we discussed earlier. The parent has a public function `start/0` which calls the `spawn_link/1` function with an anonymous function calling the other function `ready_to_receive/0`. The `ready_to_receive` defines the expression `receive` with two patterns to match the incoming data against. 

The first pattern defined by the expression matches the incoming data to the tuple `{:do_something_expensive, sender, dataset}`. If the data doesn't match, the any `_` pattern will output an error message. Both patterns recursively call `ready_to_receive/0` recursively to enable us to do a little bit of test-driving our fancy new process!

```elixir
iex> parent = Parent.start()
#PID<0.86.0>
```

First we start a new instance of the parent. The `spawn_link/1` returns us a process handle, represented by the type `PID`, which we match against the variable `parent` for later use.

```elixir
iex> send(p, :foo)            
:foo
iex> send(p, {:do_something_expensive})
Task received
{:do_something_expensive}
```

Looking good! The parent reacted to our messages as expected, and even better, handled more than a single message! Now let's allow the parent to transition to a different state.

```elixir

```
  - Walk through the previous example illustrated with code without using a supervisor
