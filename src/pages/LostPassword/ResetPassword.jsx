import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import lostpasswordDesktop from '../LoginForm/Background-LP.png';
import './LostPassword.css';
import logoClinea from '../LoginForm/logo-clinea.png';
import photoChavannerie from '../LoginForm/photo-chavannerie1.png';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import BackgroundPng from '../LoginForm/Background-LP.png'


function App() {
  return <ResetPasswordDesktop {...ResetPasswordDesktopData}  />;
}

export default App;

function ResetPasswordDesktop(props) {
  const {
    rinitialiserMotDePasse,
    votreMail1,
    inputType1,
    inputPlaceholder1,
    votreNom,
    inputType2,
    inputPlaceholder2,
  } = props;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const randomtoken = queryParams.get('randomtoken');

  console.log(randomtoken);

  // Créer un état pour chaque champ de formulaire
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  
  // permettre la navigation vers une autre page
  const navigate = useNavigate();

  // Créer une fonction pour vérifier si tous les champs sont remplis
  const isFormComplete = () => {
    return newPassword !== "" && newPasswordConfirm !== "" && newPassword === newPasswordConfirm;
  };

  const navigateToHomePage = () => {
    navigate('/login')
  }

  const handleClick = async () => {

    if (!isFormComplete()) {
        alert('Veuillez vérifier votre saisie, les deux mots de passe ne correspondent pas')
        return;
    }
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/reset-password`, { newPassword, randomtoken });
    
      alert('Votre mot de passe à bien été réinitialisé')
      navigateToHomePage(response); // Navigate to home page
    } catch (error) {
      alert('Votre mot de passe n\'a pas été réinitialisé, veuillez recommencer la procédure')
      console.error('An error occurred while set new password', error);
      // setLoginError('Aucun utilisateur trouvé'); // Set the login error message
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword, newPasswordConfirm]); // Ajoutez les dépendances à l'effet

  return (
    <div
      className="lostpassword-desktop screen"
      style={{ backgroundImage: `url(${BackgroundPng})` }}
      
    >
      <Colonne1  />
      <div className="colonne2" >
        <div className="card-form" >
          <h1 className="rinitialiser-mot-de-passe" >
            {rinitialiserMotDePasse}
          </h1>
          <div className="votre valign-text-middle label1" >
            {votreMail1}
          </div>
          <div className="text-input" >
            <div className="containerMail" >
              <input
                className="votre-mail1"
                
                name="votremail1"
                placeholder={inputPlaceholder1}
                type={inputType1}
                value={newPassword} // Utiliser l'état pour contrôler la valeur du champ
                onChange={e => setNewPassword(e.target.value)} // Mettre à jour l'état lorsque la valeur du champ change
                required
              />
            </div>
          </div>
          <div className="votre1 valign-text-middle label1" >
            {votreNom}
          </div>
          <div className="text-input" >
            <div className="input-family-name" >
              <input
                className="votre-nom-de-famille"
                name="votrenomdefamille"
                placeholder={inputPlaceholder2}
                type={inputType2}
                value={newPasswordConfirm} // Utiliser l'état pour contrôler la valeur du champ
                onChange={e => setNewPasswordConfirm(e.target.value)} // Mettre à jour l'état lorsque la valeur du champ change
                required
              />
            </div>
          </div>
           <div className="button-validate-lost-password" onClick={handleClick} onKeyDown={handleKeyDown} >
            <div
              className="valider-lost-password"
            >valider</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Colonne1() {
  return (
    <div className="colonne-15 animate-enter" >
      <LogoLFD  />
      <div className="colonne-1-11" >
        <p className="h1-lp inter-semi-bold-midnight-blue-22px" >
          CLINIQUE LA CHAVANNERIE - CHAPONOST (69)
        </p>
        <img
          className="chavan-picture1"
          src={photoChavannerie}
          alt="ChavanPicture"
        />
        <p className="colonne-1-item poppins-semi-bold-boston-blue-20px" >
          Enfin une interface pour gérer la vie de la clinique !
        </p>
        <p className="colonne-1-item poppins-normal-black-16px" >
          Avec notre nouvelle solution, la gestion des inscriptions aux jeux et activités n’a jamais été aussi simple !
        </p>
      </div>
    </div>
  );
}

function LogoLFD() {
  return (
    <div className="logo-lfd1">
      <img className="logo_-clinea" src={logoClinea} alt="Logo_Clinea" />
    </div>
  );
}

const ResetPasswordDesktopData = {
    rinitialiserMotDePasse: "Réinitialiser mot de passe",
    votreMail1: "Votre nouveau mot de passe",
    inputType1: "password",
    inputPlaceholder1: "Votre nouveau mot de passe...",
    votreNom: "Confirmez votre nouveau mot de passe",
    inputType2: "password",
    inputPlaceholder2: "Confirmez votre nouveau mot de passe...",
};