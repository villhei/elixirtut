defmodule MapOps do
   def get_key(key) do
     fn(map) -> Map.get(map, key) end
   end
end