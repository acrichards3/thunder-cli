import { helloExample } from "./api/hello.example";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, isLoading, error } = useQuery({
    queryFn: helloExample,
    queryKey: ["helloWorld"],
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
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <span className="text-white text-lg">{data.message}</span>
        </div>
      ) : null}
    </main>
  );
}

export default App;
