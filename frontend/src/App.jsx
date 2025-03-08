import React, { useEffect, useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { Layout } from './components';
import { ChatPage, HomePage, LoginPage, ProfilePage, RegisterPage, SettingsPage } from './pages';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser } from './features/authSlice';
import { Loader } from 'lucide-react';


const App = () => {
  const { isAuthenticated, isUserLoading } = useSelector(state => state.auth);
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) dispatch(authenticateUser({ route: '/api/v1/users/get-current-user' }));
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  if (isUserLoading) 
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='' element={<HomePage />} />
        <Route path='chat' element={isAuthenticated ? <ChatPage /> : <Navigate to='/login' />} />
        <Route path='profile' element={isAuthenticated ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='register' element={!isAuthenticated ? <RegisterPage /> : <Navigate to='/' />} />
        <Route path='login' element={!isAuthenticated ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='settings' element={<SettingsPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} /> 
};

export default App;