defmodule SimpleServer do
  use Application

  def start(_type, _args) do

    port = Application.get_env(:simple_server, :SERVER_PORT)

    dispatch = :cowboy_router.compile([
                 {:_, [{"/", SimpleServer.PageHandler, []}]}
               ])
    {:ok, _} = :cowboy.start_http(:http, 100,
                                  [port: port],
                                  [env: [dispatch: dispatch]])
    IO.puts("Server listening to port #{port}")
    SimpleServer.Supervisor.start_link
  end
end
