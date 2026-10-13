import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Dashboard } from '../features/dashboard/Dashboard';

import { SettingsProvider } from '../features/settings/SettingsContext';
import { SettingsModal } from '../features/settings/SettingsModal';

const AppLayout = () => {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-amber-200/60 selection:text-amber-900 relative">
        {/* Subtle top ambient radial lighting */}
        <div
          className="fixed top-0 left-0 right-0 h-96 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245, 158, 11, 0.07), transparent 70%), radial-gradient(ellipse 50% 40% at 85% 0%, rgba(99, 102, 241, 0.04), transparent 60%)',
          }}
        />
        <div className="relative z-10 flex flex-col flex-1">
          <Header />
          <Outlet />
          <Footer />
        </div>
        <SettingsModal />
      </div>
    </SettingsProvider>
  );
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 bg-[#F8FAFC]">
    <h1 className="text-3xl font-serif text-slate-900 mb-2">404 - Page Not Found</h1>
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
