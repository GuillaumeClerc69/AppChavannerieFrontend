import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from 'react-router-dom';

// Cette fonction vérifie si l'utilisateur est authentifié
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token != null;
}

// Ce composant protège une route
function ProtectedRoute({ element: Component, ...rest }) {
  const navigate = useNavigate();

  return (
    <Route {...rest} element={
      isAuthenticated() ? Component : (navigate('/login'), null)
    } />
  );
}

export default ProtectedRoute;
