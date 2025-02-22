import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useSelector } from 'react-redux';

const Layout = () => {
  const theme = useSelector(state => state.theme.currentTheme);

  return (
    <div data-theme={theme}>
      <Navbar />
      <Outlet />
    </div>
  )
};

export default Layout;