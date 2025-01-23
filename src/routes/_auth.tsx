import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <>
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-gray-700 font-medium">
            Welcome, {user.displayName}
          </p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out?")) {
                resetStore();
                auth.signOut();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300"
          >
            Sign Out
          </button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}
