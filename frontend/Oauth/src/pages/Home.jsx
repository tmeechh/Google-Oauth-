import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // For testing purposes, leave the token in the URL
    } else {
      // If there's no token, redirect to the sign-up page
      navigate('/signup');
    }
  }, [navigate]);

  return (
    <div className="text-4xl flex items-center justify-center h-screen">
      Home
    </div>
  );
};

export default Home;
