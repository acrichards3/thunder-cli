import { useQuery } from "@tanstack/react-query";
import { greet } from "@thunder-app/lib";
import { fetchUsers } from "./api/users";

function App() {
  const { data, isLoading, error } = useQuery({
    queryFn: fetchUsers,
    queryKey: ["users"],
  });

  if (data) {
    console.log("Users:", data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{greet("Thunder App")}</h1>
        <p className="text-gray-600">Welcome to Thunder App!</p>
        {isLoading && <p className="text-gray-500 mt-4">Loading users...</p>}
        {error && <p className="text-red-500 mt-4">Error: {String(error)}</p>}
        {data && <p className="text-green-500 mt-4">Check console for users data!</p>}
      </div>
    </div>
  );
}

export default App;
