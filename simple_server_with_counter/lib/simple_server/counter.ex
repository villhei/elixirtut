defmodule SimpleServer.Counter do
	
	use GenServer

	def start_link(name) do
		IO.puts("Starting counter")
		GenServer.start_link(__MODULE__, :ok, name: name)
	end

	def init(:ok) do
		{:ok, 0}
	end

	def handle_call(:get, _from, count) do
		new_count = count+1
    	{:reply, new_count, new_count}
  	end
end