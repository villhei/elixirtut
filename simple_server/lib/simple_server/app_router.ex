defmodule SimpleServer.AppRouter do
  
  use Plug.Router

  import Plug.Conn

  plug(:match)
  plug(:dispatch)

  get("/") do
    send_resp(conn, 200, "<html><h1>Hello world</h1></html>")
  end

  match(_) do
    send_resp(conn, 404, "Not found")
  end
end