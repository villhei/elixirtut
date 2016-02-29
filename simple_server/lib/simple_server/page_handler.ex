defmodule SimpleServer.PageHandler do
  def init(type, req, opts) do
    IO.puts("Init done")
    {:ok, req, :no_state}
  end

  def handle(req, state) do
  	IO.puts("Serving a request")
    {:ok, req} = :cowboy_req.reply(200, [], "<html><h1>Hello world</h1></html>", req)
    {:ok, req, state}
  end

  def terminate(_reason, _req, _state) do
  	IO.puts("Terminating the handler")
   :ok
	end
end