import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import ServiceDetailPage from './pages/Services/[id]';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import BookingsPage from './pages/Bookings';
import NotFoundPage from './pages/404';
import Layout from './components/layout/Layout';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import ProfilePage from './components/layout/ProfilePage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:id', element: <ServiceDetailPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '*', element: <NotFoundPage /> },
      { path: '/account', element: <ProfilePage /> }
    ]
  }
]);

export default function App() {

  return(
    <I18nextProvider i18n={i18n}>
   <RouterProvider router={router} />
   </I18nextProvider>
  )
}