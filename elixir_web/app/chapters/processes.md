[lambda]: img/lambda.png

<div class="quote"><p>Processes are a part of the language - they do not belong to the operating system. That's really what's wrong in languages such as Java or C++ that, threads are not in the language, they are something that's in the operating system. They inherit all the problems they have in the the operating system.</p>
    <span class="quotee">-Joe Armstrong, The principal inventor of Erlang</span>
</div>

### Introduction

Elixir inherits the concept of processes from the Erlang Virtual Machine BEAM. In Elixir all code runs within processes, which area extremely light-weight abstractions over threads. Internally BEAM creates a set of kernel-level threads and schedules the light weight threads (processes) between the more heavy-weight lower level threads. The amount of kernel level threads usually equals the amount of available CPU cores.

Process creation in Elixir and on the BEAM is really cheap in comparison to other programming languages such as Java or C#. The traditional approach is to create a new thread at the operating system level, which comes at the relatively high cost of context switching and memory use in comparison to the approach selected for BEAM.

As a result, it is no way uncommon for a typical Elixir or Erlang application to coordinate hundreds, thousands or even tens of thousands of processes on a single machine. Impressive, tempting, exciting!

Being a functional language, Elixir also doesn't face the problem of state corruption, which is a typical problem in concurrent programming using imperative languages. Because a mutable state does not exist, data does not need to be protected from writes with constructs such as locks, mutexes or semaphores.

More info, motivation: http://www.infoq.com/presentations/erlang-software-for-a-concurrent-world

There are two possible approaches to concurrency, the shared memory model, where processes lock the data for the duration needed to access it and the message passing model selected for use in BEAM.

 Shared memory
  - Problem 1: A thread crashes while doing a write in a shared region of memory making the memory corrupted and thus inaccessible for other threads
  - Problem 2: High latency for accessing the shared region of memory

To be able to utilize these features provided by BEAM, we are going to take a look at the concept of processes in Elixir.

The simplified approach selected by the BEAM and Elixir
  - No sharing of data
  - Pure message passing
  - No locks
  - Lots of computers (let one crash)
  - Functional programming (avoid side effects)

## <a name="actors"></a> Actors

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

The actor `parent` receives our initiating message `{:do_something_expensive, dataset}`. Upon receiving the message, the `parent`actor is programmed to create new actors, called `workers` that are effectively it's children.

### An actor can send messages to other actors

When the actor has created it's `workers`, the actor chunks the dataset it received and sends the chunks it to it's `workers` by with the message `{:do_calculations, chunk}`.

The `workers` receive the message and start doing the calculation, which can of course,be split to even smaller chunks and distributed to new `workers` recursively.

### An actor can designate how to handle the next message it receives

Initially, when our `parent` sends out the message to the `workers`, it changes the state from the initial state where it was ready to receive tasks, to a state where it's waiting for results from it's `workers`. 

When the `workers` finish the processing they were designated to do, they send back a message to their `parent` with the results of the tasks and choose to terminate themselves.

When the `parent` receives the first results back from a `worker` the parent transitions to (stays in) the receiving state. When the last `worker` sends the results of the task to the `parent`, the `parent` send a message to the initiater of the task and transitions back to the initial state.

### <a name="actors_supervisors"></a> Supervisors