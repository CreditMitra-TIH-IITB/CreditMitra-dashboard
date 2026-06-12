import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Dashboard } from '../features/dashboard/Dashboard';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Background grain effect */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
    <h1 className="text-3xl font-serif text-white mb-2">404 - Page Not Found</h1>
    <p>The requested route does not exist.</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
