  //import group1373 from './logo-clinea.svg';
  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { decodeToken } from 'react-jwt';
  import './PsychiatreHomePage.css';
  import dashiconsArrowDownAlt2 from './dashicons-arrow-down-alt2.png';
  import logoMiniClinea from './logoBuble.svg';
  import x61 from './loupe.png';
  import vector5 from './notificationIcon.svg';
  //import SelectPeriodVariant4 from 'path-to-selectPeriodVariant4'; // replace with actual import
  import { useNavigate } from 'react-router-dom';
  import CollapsedSidebar from '../../components/Template/Sidebar/CollapsedSidebar';
  import ExtendedSidebar from '../../components/Template/Sidebar/ExtendedSidebar';
  import PsychiatreCalendar from '../../components/psychiatre/planningPsychiatre';


  export default function PsychiatreDashBoard() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const { _id: userId } = decodedToken;
    const [sidebarExtended, setSidebarExtended] = useState(false);
    const [user, setUser] = useState(null);
    const [activeButton, setActiveButton] = useState('calendar');
    const [isCalendarClicked, setCalendarClicked] = useState(true);
    

    const buttonStyles = (button) => {
      return activeButton === button ? 'active' : '';
    };
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`, {
        headers: {
          'x-auth-token': token
        }
      });
          setUser(response.data);
        } catch (error) {
          console.error('There was an error!', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          navigate('/login');
        }
      };
      fetchUser();
      // eslint-disable-next-line
    }, [userId]); 

    const handleClick = (buttonName) => {
      setActiveButton(buttonName);
      if (buttonName === 'deconnexionIcone') {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login');
      }
      if (buttonName === 'calendar') {
        setCalendarClicked(true);
      }
    };

    const handleSidebarToggle = () => {
      setSidebarExtended(!sidebarExtended);
      console.log(sidebarExtended);
    };

    return (
<div className={`container-center-horizontal ${sidebarExtended ? 'sidebar-extended' : 'sidebar-collapsed'}`}>
  <div className="psychiatredashboardscreen">
    {sidebarExtended ? (
      <>
      <ExtendedSidebar handleClick={handleClick} buttonStyles={buttonStyles} sidebarExtended={!sidebarExtended}/>
      <div className="btn-extnd" onClick={handleSidebarToggle}>
        <img className="dashiconsarrow-down-alt2" src={dashiconsArrowDownAlt2} alt="dashicons:arrow-down-alt2" />
      </div>
      </>
    ) : (
      <>
        <CollapsedSidebar handleClick={handleClick} buttonStyles={buttonStyles} sidebarExtended={sidebarExtended}/>
        <div className="btn-extnd" onClick={handleSidebarToggle}>
          <img className="dashiconsarrow-down-alt2" src={dashiconsArrowDownAlt2} alt="dashicons:arrow-down-alt2" />
        </div>
      </>
    )}

            <Head prnomNom={`${user?.firstname} ${user?.lastname}`} userType={user?.userType} >
            </Head>
            <div className='container-main'>
            {isCalendarClicked && <PsychiatreCalendar />}
            </div>
  </div>
</div>
    );
  }

  function Head({ prnomNom, userType }) {
    return (
      <div className="head">
        <div className="global-search-bar-psy">
              <input
                className="rechercher-un-patien poppins-normal-cadet-blue-14px"
                name="rechercherunpatientuneactivitéthérapeutiqueouunedate"
                placeholder="Rechercher un patient, une activité thérapeutique ou une date..."
                type="text"
              />
              <img className="icon-search" src={x61} alt="icon-search" />
            </div>
        <div className="overlap-group">
          <div className="prnom-nom poppins-semi-bold-white-14px">
            {prnomNom}
          </div>
          <div className="psychiatre poppins-normal-moody-blue-14px-2">
            {userType}
          </div>
        </div>
        <div className="rectangle-3256"></div>
        <div className="logo-buble">
          <img className="x6logo-parent" src={logoMiniClinea} alt="6logoParent" />
        </div>
        <div className='notificationContainer'>
        <img className="notification-icon" src={vector5} alt="notificationIcon " />
        </div>
      </div>
    );
  }
