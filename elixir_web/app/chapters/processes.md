[lambda]: img/lambda.png
<div class="warning">
  <span>TODOS</span
  <ul>
    <li>The page looks a little boring</li>
    <li>The introduction needs a little more work</li>
  </ul>
</div>

<div class="quote"><p>Processes are a part of the language - they do not belong to the operating system. That's really what's wrong in languages such as Java or C++ that, threads are not in the language, they are something that's in the operating system. They inherit all the problems they have in the the operating system.</p>
    <span class="quotee">-Joe Armstrong, The principal inventor of Erlang</span>
</div>
## Introduction to processes

Elixir inherits the concept of processes from the Erlang Virtual Machine BEAM. In Elixir all code runs within processes, which area extremely light-weight abstractions over threads. Internally BEAM creates a set of kernel-level threads and schedules the light weight threads (processes) between the more heavy-weight lower level threads. The amount of kernel level threads usually equals the amount of available CPU cores.

Process creation in Elixir is really cheap in comparison to other programming languages such as Java or C#. The traditional approach is to create a new thread at the operating system level, which comes at a relatively high cost of context switching and memory use in comparison to the approach selected for BEAM.

Because of the multi-threaded nature of the BEAM virtual machine, Elixir processes run in *parallel*. Parallelism is concept distinct from concurrency. Many single-threaded languages such as JavaScript allow for *concurrent* execution, but not for *parallel* execution.

Parallel means simultaneous execution of possible related computations in multiple processor cores. In turn, concurrency references to the composition of independentely executing processes. Or well, if you work on an ancient single-threaded machine, even resorting to Elixir won't make your computations parallel.

As a result, it is no way uncommon for a typical Elixir or Erlang application to coordinate hundreds, thousands or even tens of thousands of processes on a single machine. Impressive, tempting, exciting!

Being a functional language, Elixir also doesn't face the problem of state corruption, which is a typical problem in concurrent programming using imperative languages. Because mutable state does not exist, data does not need to be protected from writes with constructs such as locks, mutexes or semaphores.

More info, motivation: http://www.infoq.com/presentations/erlang-software-for-a-concurrent-world

There are two possible approaches to parallelism and concurrency: *the shared memory model*, where processes lock the data for the duration needed to access it and the *message passing* model selected for use in BEAM.

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

<div class="key-concept">
  ![Key concept][lambda]<span>Note about processes</span>
  <p>Processes play an important role in fault-tolerant systems. Processes in Elixir applications are usually <i>linked</i> to special processes called supervisors.</p>

  <p>In case of a process failure, the supervisor process usually restarts the process group that failed. This is possible because processes are isolated and <b>do not</b> share any data with other processes. Since processes are isolated, a failure in a process <b>will not</b> crash or corrupt the state of another process.</p>

  <p>Remember, it's completely okay for a process to fail, for there is very little overhead in creating a new process to replace the failed one.</p> 
</div>
## <a name="actors"></a> Some formalism with actors

Defined more formally, the independent processing units (processes) in Elixir and the BEAM follow the definition of an [Actor](https://en.wikipedia.org/wiki/Actor_model). Actor is a concept introduced by Carl Hewitt in 1973 as an alternative to the object-oriented approach for stucturing of programs. 

Programs strcutured using the actor model have sometimes been said to follow a "1000 year-old design pattern". A program composing of multiple different types of individual actors very much resembles the way humans interact with each other in order to perfrom a collaborative task - hence the name actors.

The actor model has recently gained a lot of traction as it happens to fit the concurrent programming model really well. A process in Elixir is basically an actor, and all actors are independent parallel units of computation communicating via message passing.

**Characteristics of the actor model**
  * An actor is a fundamental unit of computation with processing, storage and communication
  * An actor can send and receive messages
  * An actor has a mailbox
  * Everything is an actor

**The behavior of an actor is defined by the axioms**
  * An actor can create new actors
  * An actor can send messages to other actors it knows of
  * An actor can designate how to handle the next message it receives

Let's look at these fundamental rules in a bit more detail by using a scenario example of distributing a CPU-heavy parallelizable task to a set of actors. 

Let's imagine our actor is modelled as a a state-machine. We first create an actor that specializes in some CPU-bound task. The actor initially starts from a state, where the actor is configured to receive these CPU-heavy tasks of ours.

### An actor can create new actors

The actor `parent` receives our initiating message `{:do_something, sender, dataset}`. Upon receiving the message, the `parent`actor is programmed to create new actors, called `workers` that are effectively it's children.

### An actor can send messages to other actors

When the actor has created it's `workers`, the actor chunks the dataset it received and sends the chunks it to it's `workers` by with the message `{:do_calculations, chunk}`.

The `workers` receive the message and start doing the calculation, which can of course be split to even smaller chunks and distributed to new `workers` recursively.

### An actor can decide how to handle the next message it receives

Initially when the `parent` sends out the message to the `workers`, it changes the state from the initial state where it was ready to receive tasks to a state where it's waiting for results from it's `workers`. 

When the `workers` finish the processing they were designated to do, they send back a message to their `parent` with the results of the tasks and choose to terminate themselves.

When the `parent` receives the first results back from a `worker` the parent transitions to (stays in) the receiving state. When the last `worker` sends the results of the task to the `parent`, the `parent` sends a message to the initiater of the task and transitions back to the initial state.

## Spawning processes

It turns out we have been working inside a BEAM process this whole time! That means, the thread we are working in can be used to spawn processes. Let's confirm this fact immediately. 

### The keys to the kingdom with `spawn/1`

```elixir
iex> spawn(fn -> 5 * 5 end)
#PID<0.62.0> 
```

We use the function `spawn/1` to create a process that does something really simple. In exchange for the anonymous function it starts working with, the function `spawn/1` returns a process identifier of type `PID`. We can use the freshly obtained `PID` as a handle to access to process in case we want some further communication with it.

```elixir
iex> pid = spawn(fn -> 5 * 5 end)
#PID<0.80.0>
iex> Process.alive?(pid)
false
```

Assigning the process `PID` to a variable allows us to inspect the process after it has been spawned. Quite unsurprisingly, we weren't fast enough to type in the `Process.alive?/1` function, and the process lasting just a few instructions terminated and the call to `Process.alive?/1` yielded a `false`.

```elixir
iex> self()
#PID<0.57.0>
iex> Process.alive?(self())
true
```

Because the `iex` interactive REPL session is also a running process, we can easilly find a living specimen of a process by calling the `self/0` function. As a result of the call we have obtained the current `PID` of the process we are working in. The `self/0` can also be used from within child processes as a tool for obtaining the process identifier of the running process.

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

There is no shame in talking to your self, everybody does it sometimes. By obtaining the process handle with `self/0` we can send a message consisting of the atom `:you_have_mail`. The expression `receive` works just like the conditional structure `case`. Unlike `case`, the `receive` expression does not take an explicit parameter, but it blocks the process until it reads the next message from the process' mailbox to match against. 

The message is then matched against the patterns provided for the `receive` expression. In the case presented the results are sort of predictable.

![Warning][warning] Be vary of what kind of data you are sending between processes. Elixir and Erlang processes having their own memory (heaps) means that all data sent between processes is always copied. So extensive use of processes might come at a cost of data copying. For example, when building pipelines data pipelines, you might be better off handling the data in a single process instead of moving it around.

```elixir
iex> receive do
...>  :foo -> msg
...> after
...>  1_000 -> "Timeout after a second"
...> end
Timeout after a second
```

When working with the `receive` expression, you sometimes want to make sure (especially in `iex` shell sessions) that the `receive` expression doesn't block the thread forever. A timeout can be supplied in an `after` block. The timeout is given in milliseconds, which the Elixir syntax makes quite readable for us with a tendency towards dyslexia. The timeout can also be a `0` in case you are expecting `receive` to find mail from the mailbox right away.

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

Holy Uncanny Process! Yes, it really is this easy. We first assign the variable `parent` to point to the `iex` shell session. Then we spawn an anonymous function, which uses `send/2` to send the parent a message with the payload consisting of the atom `:hey_there` and a reference to the sender, which is points to newly created anonymous function.

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

## Process links with `spawn_link/1`

The Erlang virtual machine supports a concept called process link. A link between the process is a relationship between processes that change the behavior in case of crashes. In case of a crash a linked child process will bring down the parent process. Also in the case of a parent failure, the link also causes the child processes to die. 

This behavior is a useful property with links, when we take dependencies between processes in to consideration. If a process dies, it's a good idea to kill the processes that depend on it rather than resolving the potentially missing dependencies manually. An alternative to manual resolving is just to restart the whole process tree or group. This is a part of the let-it-die, or fail fast philosophy of both Erlang and Elixir. 

```elixir
iex> pid = spawn(fn -> raise "hell" end)
#PID<0.71.0>
iex>
18:04:03.476 [error] Process #PID<0.71.0> raised an exception
** (RuntimeError) hell
    :erlang.apply/2
iex> send(pid, :hello)
:hello
iex> flush()
:ok
```

When we create a new process using `spawn/1` and have it crash, the `iex` interpreter continues it's operation normally. In the case of the process potentially dying, we can still send messages to that process and we really have no idea whether it received the message or not.

```elixir
iex> flush()
:ok
iex> Process.alive?(pid)
false
```

The `flush/0` function does not give any hints of the message delivery failing, but when we query the process with `Process.alive?/1`, we finally get a falsy answer. Failing fast is a lot better alternative to manually querying processes, although your mileage may vary.

```elixir
iex(9)> pid = spawn_link(fn -> raise "hell" end)
** (EXIT from #PID<0.69.0>) an exception was raised:
    ** (RuntimeError) hell
        :erlang.apply/2

18:09:22.606 [error] Process #PID<0.82.0> raised an exception
** (RuntimeError) hell
    :erlang.apply/
2re
Interactive Elixir (1.2.3) - press Ctrl+C to exit (type h() ENTER for help)
iex(1)>
```

The `spawn_link/1` can be used exactly like the `spawn/1` function, but the difference is, that it makes the parent process die in case of the child dying. It is kind of scary to see the `iex` process crashing at the same time - but it's comforting to know that in a real-life scenario our application would basically just restart and continue normal operation. 

We don't really have to worry about these linked processes crashing our application all the time. Elixir and Erlang feature a special type of process called the (process) supervisor for this purpose. We will discuss supervisors in a bit more detail in the next chapter.

## Registering a process

Registering a process is basically giving a process a well-known name within an application. The name allows the process to be accessed by other processes by calling it's name. This is a useful property in cases such as implementing application-wide services. The name is represented by an `:atom` value.

```elixir
defmodule Ponger do
  def start() do
    spawn_link(fn -> do_receive() end)
  end

  defp do_receive() do
    receive do
      {:ping, sender} -> 
        send(sender, :pong)
        do_receive()
      _ ->
        do_receive()
    end
  end
end  
```

Let's implement a simple module `Ponger`. `Ponger` is a service that doesn't really care where the messages come from, and can interact directly with the any sender process. The `do_receive/0` defines two patterns for incoming messages. The other pattern requires the atom `:ping` and a sender. The other pattern will just call `do_receive/0` again, if the message couldn't be recognized.

```elixir
iex> pid = Ponger.start()
#PID<0.77.0>
iex> Process.register(pid, :ponger)
true
iex> Process.register(pid, :ponger)
** (ArgumentError) argument error
             :erlang.register(:ponger, #PID<0.77.0>)
    (elixir) lib/process.ex:338: Process.register/2
```

We start by spawning a new instance of `Ponger`, assigning it's process identifier to the variable `pid`. The next function, `Process.register/2` accepts the process id and a name represented by an `:atom`. Notice that the first call to `Process.register/2` produces a `true`. The second call raises an error, as the name we attempted to register was already reserved.

```elixir
iex> send(:ponger, {:ping, self()}) 
{:ping, #PID<0.58.0>}
iex> flush()
:pong
:ok
```

After registering the name, we can substitute the process identifier taken as the first parameter of `send/2` with the atom `:ponger`. Using the registered atom in `send/2` calls makes calling `Ponger` quite a bit more convenient.

## Modelling a state machine

Now that we have taken a closer look to processes, let's start building something a little more complex and return to the abstract example of `parent` and `worker`s used in the introductory section.

```elixir
defmodule Parent do
  def start() do
    spawn_link(fn -> ready_to_receive() end)
  end

  defp ready_to_receive() do 
    receive do
      :do_something ->
        IO.puts("Task received")
        ready_to_receive()
      _ -> 
        IO.puts("Can't handle this")
        ready_to_receive()
    end
  end
end
```

Let's start by defining a really simple implementation for the behavior of `parent` we discussed earlier. The parent has a public function `start/0` which calls the `spawn_link/1` function with an anonymous function calling the other function `ready_to_receive/0`. The function `ready_to_receive` defines the expression `receive` with two patterns to match against the incoming data. 

The first pattern defined by the expression matches the incoming data to the atom `:do_something`. If the data doesn't match, the any `_` pattern will output an error message. Both patterns recursively call `ready_to_receive/0` recursively to enable us to do a little bit of test-driving our fancy new process.

```elixir
iex> parent = Parent.start()
#PID<0.86.0>
```

First we start a new instance of the parent. The `spawn_link/1` returns us a process handle, represented by the type `PID`, which we match against the variable `parent` for later use.

```elixir
iex> send(p, :foo)            
:foo
iex> send(p, :do_something)
Task received
:do_something
```

Looking good! The parent reacted to our messages as expected, and even better: handled more than a single message. Now let's allow the `Parent`'s transition to a different state.

At this point, working in the `iex` interpreter is getting a little challenging. I recommended you to create a new elixir script `state_machine.exs`, which can be executed by entering the command `elixir state_machine.exs` in the directory the file was saved in.

```elixir
defmodule Parent do
  def start() do
    spawn_link(fn -> ready_to_receive() end)
  end

  defp ready_to_receive() do 
    receive do
      :do_something ->
        IO.puts("Task received")
        task_running()
      _ -> 
        IO.puts("Can't handle this")
        ready_to_receive()
    end
  end

  defp task_running() do
    receive do
      _ -> IO.puts("I am busy, bother me later")
           task_running()
    end
  end
end

parent = Parent.start()

send(parent, :foo)
send(parent, :do_something)
send(parent, :foo)
```

```bash
$ elixir test.exs
Can\'t handle this
Task received
I am busy, bother me later
```

By adding a second privately defined function `task_running/0` we are allowing an instance of the `Parent` module to perform a *state transition* when it receives a message with the atom `:do_something`. So far, our new state is a little bit dumb, as it can't really perform anything else than output a message indicating it's busy doing nothing.

```elixir
defmodule Worker do
  def start(parent, n) when is_pid(parent) and is_number(n) do
    spawn_link(fn -> send(parent, {:job_done, self(), do_square(n)}) end)
  end

  defp do_square(n) do
    n*n
  end
end
```

Now it's the time to add a second module `Worker` to our script. The worker defines two functions `start/2` which takes a sender process to send the result back to and a number `n` indicating the number to be squared. The worker will respond with a tuple `{:job_done, pid, result}` when it finishes the task. We opt to use the `pid` to determine which worker sent the result in order to allow our parent to preserve ordering of the results.

Notice that we also choose to use a function guard here to enforce the type safety. Using a guard is completely optional, but we choose to use one for the sake of practice.

```elixir
iex> Worker.start(self, 5)
#PID<0.52.0>
iex> receive do
...> x -> IO.inspect(x)
...> end
{:job_done, #PID<0.52.0>, 25}
```

Now that we have verified our `Worker` does pretty much what we intended, let's finish our implementation of the `Parent` module to use it. Take a long breath, we're almost there! 

```
defmodule Parent do
  def start() do
    # Unchanged from previous examples
  end

  defp ready_to_receive() do 
    receive do
      # We now use a tuple here, in order to take in a command and parameters
      {:do_something, sender, dataset} ->
        # We want to extract the heavy lifting out of here
        start_task(sender, dataset)
      x -> 
        IO.puts("Can't handle this #{inspect(x)}")
        ready_to_receive()
    end
  end

  defp start_task(initiator, dataset) do
    # We map over the dataset and grab the PID's of the started workers
    # in order to preserve the order in which the input data was given
    workers = dataset |> Enum.map(fn n -> Worker.start(self(), n) end)
    # Use an empty map for receiving results, because we can't know 
    # in which order they will arrive. Don't we all just love asynchronism?
    task_running(initiator, workers, %{})
  end

  defp task_running(initiator, workers, result_map) do
    receive do
      {:job_done, sender, result} ->
        # Whenever a result comes in, insert it into the result map
        # remember overwriting the variable result_map is perfectly safe
        result_map = Map.put(result_map, sender, result)
        # Inspect if the result count matches the number of workers
        case Map.size(result_map) == length(workers) do
        # If all results are in, send them back and transition back to 
        # accepting new jobs
          true -> 
            send_results(initiator, workers, result_map)
            ready_to_receive()
        # If all results are not in yet, stay in current state
          false -> 
            task_running(initiator, workers, result_map)
        end
        # Keep on telling we're busy
      _ -> IO.puts("I am busy, bother me later")
           task_running(initiator, workers, result_map)
    end
  end

  # Map over the workers, and grab the result corresponding the worker
  # from the result map, resulting in an ordered list of results
  defp send_results(initiator, workers, result_map) do
    results = workers |> Enum.map(fn w -> Map.get(result_map, w) end)
    send(initiator, {:done, results})
  end
end
```

All good and dandy. We made quite a lot of changes and additions to the `Parent` module. The principle of the new operation is explained in the comments above. The basic concept here to is to make the `Parent` a stateful module by updating the state every time an appropriately formed message arrives and passing the preserving the updated state by calling `task_running/3` with the new state over and over again.

```elixir
parent = Parent.start()

send(parent, {:do_something, self(), [1,2,3,4,5]})

receive do 
  {:done, res} -> IO.puts("Received a result #{inspect(res)}")
  after
    1_000 -> IO.puts ("Timeout")
end
```

We can test our newly implemented state machine by adding the code above to the same script file where the `Worker` and `Parent` module definitions lie.

```bash
$ elixir state_machine.exs
Received a result [1, 4, 9, 16, 25]
```

Nice! We basically implemented a map-reduce type of action using a finite state machine. Our FSM first splits the task, collects the results and reports them back to the sender. Although it feels a little shameful that the `do_square/1` function we implemented in the `Worker` module would have performed a lot faster had we implemented it as an inline lambda, but let's not get stuck on the minor details.

```elixir
      msg -> IO.puts("I am busy, bother me later")
           send(self(), msg)
           task_running(initiator, workers, result_map)
```

As a side note, changing the last match condition in `task_running/3` from using the `_` underscore to recognize a message `msg`, we can send the message back to the instance of the parent by calling `send/2` with `self()` and `msg`, which effectively creates a queuing mechanism, albeit a naive one.

This concludes our tour of processes. In the next chapter we will look at some built-in constructs on processes that allow us to implement similar functionality with a lot less code using the built-in abstractions for generalized process behaviors. 
