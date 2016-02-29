defmodule SimpleServer do
  use Application

  def start(_type, _args) do
    port = Application.get_env(:simple_server, :SERVER_PORT)
    IO.puts("Server starting listen in port #{port}")

    Plug.Adapters.Cowboy.http(SimpleServer.AppRouter, [], port: port)
  end

  def stop do
    Plug.Adapters.Cowboy.shutdown(SimpleServer.AppRouter.HTTP)
  end
end
