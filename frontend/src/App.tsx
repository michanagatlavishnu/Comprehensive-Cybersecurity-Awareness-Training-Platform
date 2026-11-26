import AppRouter from "./app/router/AppRouter";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <AppRouter />
    </div>
  );
}