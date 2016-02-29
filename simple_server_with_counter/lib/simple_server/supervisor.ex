defmodule SimpleServer.Supervisor do
  use Supervisor

  def start_link do
    :supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    port = Application.get_env(:simple_server, :SERVER_PORT)
    IO.puts("Server starting listen in port #{port}")

    counter = worker(SimpleServer.Counter, [SimpleServer.Counter])
    server = Plug.Adapters.Cowboy.child_spec(:http, SimpleServer.AppRouter, [], [port: port]) 
    
    children = [counter, server]
    supervise(children, strategy: :one_for_one)
  end
end
