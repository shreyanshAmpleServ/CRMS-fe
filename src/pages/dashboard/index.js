// src/components/Dashboard.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };
 
  return (
    <div>
      <Helmet>
        <title>Dashboard - {user?.username || 'Guest'}</title>
        <meta name="description" content={`Welcome to your dashboard, ${user?.username}.`} />
      </Helmet>
      <h2>Welcome, {user?.username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
