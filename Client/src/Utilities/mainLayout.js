import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = !['/login', '/register', '/forgetPassword'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

export default MainLayout;
