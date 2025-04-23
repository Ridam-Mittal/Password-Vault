import Header from './Header';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Toaster/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
