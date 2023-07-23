import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoginPage from "./pages/LoginForm/LoginForm";
import LostPassword from './pages/LostPassword/LostPassword';
import SuperAdminHomePage from './pages/SuperAdmin/superAdminHomePage';
import AdminActivitiesHomePage from './pages/adminActivites/adminActivitiesHomePage';
import PatientHomePage from './pages/patient/PatientHomePage';
import AdminJeuxHomePage from './pages/adminJeux/AdminJeuxHomePage';
import PsychologueHomePage from './pages/psychologue/PsychologueHomePage';
import PsychiatreHomePage from './pages/psychiatre/PsychiatreHomePage';
import ResetPassword from './pages/LostPassword/ResetPassword'
import './StyleGuide.css'

function App() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(localStorage.getItem('userType'));


  useEffect(() => {
    navigateToHomePage(userType);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  const navigateToHomePage = (newUserType) => {
    if (newUserType !== userType) {
      setUserType(newUserType);
      switch (newUserType) {
        case 'superAdmin':
          navigate('/superadmin');
          break;
        case 'adminActivities':
          navigate('/adminactivities');
          break;
        case 'patient':
          navigate('/patient');
          break;
        case 'adminJeux':
          navigate('/adminjeux');
          break;
        case 'psychologue':
          navigate('/psychologue');
          break;
        case 'psychiatre':
          navigate('/psychiatre');
          break;
        default:
          console.error('Unknown user type:', newUserType);
      }
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token != null;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/lost-password" element={<LostPassword />} />
      <Route path="/superadmin" element={isAuthenticated() ? <SuperAdminHomePage /> : <Navigate to="/login" />} />
      <Route path="/adminactivities" element={isAuthenticated() ? <AdminActivitiesHomePage /> : <Navigate to="/login" />} />
      <Route path="/patient" element={isAuthenticated() ? <PatientHomePage /> : <Navigate to="/login" />} />
      <Route path="/adminjeux" element={isAuthenticated() ? <AdminJeuxHomePage /> : <Navigate to="/login" />} />
      <Route path="/psychologue" element={isAuthenticated() ? <PsychologueHomePage /> : <Navigate to="/login" />} />
      <Route path="/psychiatre" element={isAuthenticated() ? <PsychiatreHomePage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
export default App;
