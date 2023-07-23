import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginForm.css';
import loginformReponsive from './Background-LP.png';
import chavanpicture from './photo-chavannerie1.png';
import logoClinea from './logo-clinea.png';
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';


function LoginPage() {
  return <LoginFormReponsive {...loginFormReponsiveData} />
}

export default LoginPage;

function LoginFormReponsive(props) {
  const {
    h1Lp,
    h2Lp,
    pLp,
    title,
    vousNavezPasEncoreDeCompte,
    premireConnexion,
    votreIdentifiant,
    inputType1,
    inputPlaceholder1,
    votreMotDePasse,
    inputType2,
    inputPlaceholder2,
    seConnecter,
    motDePassePerdu,
  } = props;

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate(); 
const [loginError, setLoginError] = useState(''); 



const handleLogin = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, password });
    const { data: token } = response;
    const decodedToken = decodeToken(token); // Use decodeToken here
    if (decodedToken) {
      const { userType, firstname, lastname, doctor, email, phone, roomnumber } = decodedToken;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('firstname', firstname);
      localStorage.setItem('lastname', lastname);
      localStorage.setItem('doctor', doctor);
      localStorage.setItem('email', email);
      localStorage.setItem('phone', phone);
      localStorage.setItem('roomnumber', roomnumber);

      navigateToHomePage(userType); // Navigate to home page
    }
  } catch (error) {
    console.error('An error occurred while logging in:', error);
    setLoginError('Identifiant ou mot de passe incorrect'); // Set the login error message
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
};

useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, );


const handleLostPassword = () => {
  navigate('/lost-password');
};

const navigateToHomePage = (userType) => {
  switch (userType) {
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
      console.error('Unknown user type:', userType);
  }
};



return (
    <div className="loginform-reponsivescreen" style={{ backgroundImage: `url(${loginformReponsive})` }}>
      <div className="colonne-1 animate-enter">
        <LogoLFD />
        <div className="colonne-1-1">
          <p className="h1-lp inter-semi-bold-midnight-blue-22px">
            {h1Lp}
          </p>
          <img className="chavan-picture" src={chavanpicture} alt="ChavanPicture" />
          <p className="colonne-1-item poppins-semi-bold-boston-blue-20px">
            {h2Lp}
          </p>
          <p className="colonne-1-item poppins-normal-black-16px">
            {pLp}
          </p>
        </div>
      </div>
      <div className="colonne2-lf animate-enter1">
        <div className="login-box">
          <h1 className="title">
            {title}
          </h1>
          <p className="vous-navez-pas-encore-de-compte poppins-normal-black-16px">
            {vousNavezPasEncoreDeCompte}
          </p>
          <div className="premire-connexion valign-text-middle poppins-semi-bold-boston-blue-12px">
            {premireConnexion}
          </div>
          <div className="votre-identifiant valign-text-middle label1">
            {votreIdentifiant}
          </div>
          <div className="text-input-mail">
          <input
            className="votre-mail"
            name="votremail"
            placeholder={inputPlaceholder1}
            type={inputType1}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          </div>
          <div className="votre-mot-de-passe valign-text-middle label1">
            {votreMotDePasse}
          </div>
          <div className="text-input-password">
          <input
            className="saisir-votre-mot-de-passe"
            name="saisirvotremotdepasse"
            placeholder={inputPlaceholder2}
            type={inputType2}
            value={password}
            autocomplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          </div>
          <div className="frame-2" onClick={handleLogin} onKeyDown={handleKeyDown}>
            <div className="se-connecter valign-text-middle poppins-bold-white-13px">
              {seConnecter}
            </div>
          </div>
          {loginError && <div className="login-error">{loginError}</div>} {/* Display the error message if it exists */}
          <div className="mot-de-passe-perdu valign-text-middle poppins-semi-bold-boston-blue-12px " onClick={handleLostPassword}>
            {motDePassePerdu}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoLFD() {
  return (
    <div className="logo-lfd">
      <img className="logo_-clinea" src={logoClinea} alt="Logo_Clinea" />
    </div>
  );
}

const loginFormReponsiveData = {
    h1Lp: "CLINIQUE LA CHAVANNERIE - CHAPONOST (69)",
    h2Lp: "Enfin une interface pour gérer la vie de la clinique !",
    pLp: "Avec notre nouvelle solution, la gestion de votre séjour n’a jamais été aussi simple !",
    title: "Se connecter",
    vousNavezPasEncoreDeCompte: "Vous n’avez pas encore de compte ?",
    premireConnexion: "Première connexion",
    votreIdentifiant: "Votre identifiant",
    inputType1: "email",
    inputPlaceholder1: "Votre email...",
    votreMotDePasse: "Votre mot de passe",
    inputType2: "password",
    inputPlaceholder2: "Saisir votre mot de passe...",
    seConnecter: "Se connecter",
    motDePassePerdu: "Mot de passe perdu",
};