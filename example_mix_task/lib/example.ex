defmodule Mix.Tasks.Hello do

	use Mix.Task

	def run(_) do
		IO.puts("Hello Mix Task!")
	end
end
