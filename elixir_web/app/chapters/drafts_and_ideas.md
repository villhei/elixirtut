## <a name="reactive_applications"> Reactive applications

    - Have to use phoenix for examples, it's a little too heavyweight for exercises
    - Phoenix has WebSocket channels that can handle communication between subscribers
    - Phoenix fails to run if Node < 4.0 or NPM < 3.0
    

### Game of Life

Life.Board.t is a convention

defomdule Life.Board do
    @type t :: map
end


Enum.scan -- sounds good for primes
Enum.unfold --- for fibonacci