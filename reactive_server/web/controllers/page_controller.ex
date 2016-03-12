defmodule ReactiveServer.PageController do
  use ReactiveServer.Web, :controller

  def index(conn, _params, current_user, _claims) do
    conn 
    |> render("index.html", current_user: current_user, claims: _claims)
  end
end
