import { fetchUsers } from "./api/users.example";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, isLoading, error } = useQuery({
    queryFn: fetchUsers,
    queryKey: ["users"],
  });

  return (
    <main className="flex flex-1 flex-col border border-red-500 items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to Thunder App!
        </h1>
        {isLoading ? (
          <span className="text-gray-300 mt-4">Loading user data...</span>
        ) : error ? (
          <span className="text-red-500 mt-4">Error: {String(error)}</span>
        ) : data ? (
          <span className="text-green-500 mt-4">{JSON.stringify(data)}</span>
        ) : null}
      </div>
    </main>
  );
}

export default App;
