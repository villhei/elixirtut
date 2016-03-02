defmodule ReactiveServer.HelloController do
	use ReactiveServer.Web, :controller

	def index(conn, _params, current_user, _claims) do
		render(conn, "index.html")
	end

	def show(conn, %{"messenger" => messenger}, current_user, _claims) do
		render(conn, "show.html", messenger: messenger, current_user: current_user)
	end
end