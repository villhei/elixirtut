defmodule SimpleServer do
  use Application

  def start(_type, _args) do
    SimpleServer.Supervisor.start_link()
  end

  def stop do
    Plug.Adapters.Cowboy.shutdown(SimpleServer.AppRouter.HTTP)
  end
end
