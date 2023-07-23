import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function SuperAdminHomePage () {
  const navigate = useNavigate(); // Use useNavigate

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the user's token
    localStorage.removeItem('userType'); // Remove the user's type
    navigate('/login'); // Navi0+gate to login page
  };

  console.log('hello Super')

  return (
    <div>
      <h1>Super Admin Home Page</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default SuperAdminHomePage;


