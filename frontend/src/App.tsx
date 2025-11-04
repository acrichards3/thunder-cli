import { fetchUsers } from "./api/users.example";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, isLoading, error } = useQuery({
    queryFn: fetchUsers,
    queryKey: ["users"],
  });

  return (
    <main className="flex flex-1 flex-col items-center gap-4 justify-center px-4 py-8">
      <img
        alt="Thunder App Logo"
        className="h-24 w-24 drop-shadow-lg"
        src="/thunder-app-logo.png"
      />
      <h1 className="text-7xl p-2 font-bold text-white drop-shadow-md">
        Welcome to Thunder App!
      </h1>
      <span className="text-gray-300 p-4 text-lg">
        Your modern full-stack application template
      </span>

      {isLoading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      ) : error ? (
        <div className="flex flex-col gap-2 bg-red-500/10 border border-red-500/50 rounded-lg p-2 max-w-md">
          <span className="text-red-400 font-semibold">Error loading data</span>
          {error && (
            <span className="text-red-300 p-2 text-sm">{error.message}</span>
          )}
        </div>
      ) : data ? (
        <div className="flex gap-4">
          {data.map((user) => (
            <div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-colors"
              key={user.id}
            >
              <div className="flex gap-2 items-center p-2">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">
                    {user.name}
                  </h3>
                  <span className="text-gray-300 text-sm">{user.email}</span>
                </div>
              </div>
              <div className="border-t border-white/10">
                <span className="text-gray-400 text-xs">ID: {user.id}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}

export default App;
