defmodule SimpleServer.AppRouterTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts SimpleServer.AppRouter.init([])

  test "returns hello world" do
    # Create a test connection
    conn = conn(:get, "/")

    # Invoke the plug
    conn = SimpleServer.AppRouter.call(conn, @opts)

    # Assert the response and status
    assert conn.state == :sent
    assert conn.status == 200
    assert conn.resp_body == "<html><h1>Hello world</h1></html>"
  end

    test "returns 404" do
    # Create a test connection
    conn = conn(:get, "/nonexistant")

    # Invoke the plug
    conn = SimpleServer.AppRouter.call(conn, @opts)

    # Assert the response and status
    assert conn.state == :sent
    assert conn.status == 404
    assert conn.resp_body == "Not found"
  end
end