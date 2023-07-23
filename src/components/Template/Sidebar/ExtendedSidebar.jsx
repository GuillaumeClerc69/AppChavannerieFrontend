import React from 'react';
import { ReactComponent as ParametresIcon2 } from './parametresIcon.svg';
import { ReactComponent as DeconnexionIcone2 } from  './ic_round-log-out.svg';
import { ReactComponent as CalendarIcon } from './akar-icons_calendar.svg';
import { ReactComponent as IconFile } from './iconFile.svg';
import { ReactComponent as LogoActivites2 } from './iconoir_yoga.svg';
import logoClinea2 from './logo-clinea.png';
import logoMiniClinea from './logoBuble.svg';

function ExtendedSidebar ({ handleClick, buttonStyles, handleSidebarToggle, sidebarExtended}) {
  return (
    <div className={`bg ${sidebarExtended ? 'sidebar-extended' : 'sidebar-collapsed'}`}>
      <img className="logo-clinea" src={logoMiniClinea} alt="logo-clinea" />
      <img className="logo-clinea2" src={logoClinea2} alt="logo-clinea" />
        <div className='columnIcon'>
          <div className={`planning ${buttonStyles('calendar')}`} onClick={() => handleClick('calendar')}>
            <div className={`logo-calendar-select ${buttonStyles('calendar')}`}>
              <CalendarIcon className={`calendar ${buttonStyles('calendar')}`} />
            </div>
            <div className={`planningTxt valign-text-middle ${buttonStyles('calendar')}`} onClick={() => handleClick('calendar')}>
              Planning
            </div>
          </div>

          <div className={`iconfile ${buttonStyles('iconFile')}`} onClick={() => handleClick('iconFile')}>
  <div className={`icon-file ${buttonStyles('iconFile')}`}>
    <IconFile className={buttonStyles('iconFile')} />
  </div>
  <div className={`patients valign-text-middle ${buttonStyles('iconFile')}`} onClick={() => handleClick('iconFile')}>
    Patients
  </div>
</div>


          <div className={`activites ${buttonStyles('logoActivites2')}`} onClick={() => handleClick('logoActivites2')}>
            <div className={`logo-activites2 ${buttonStyles('logoActivites2')}`}>
              <LogoActivites2 className={`logo-activities ${buttonStyles('logoActivites2')}`} />
            </div>
            <div className={`activits valign-text-middle ${buttonStyles('logoActivites2')}`} onClick={() => handleClick('logoActivites2')}>
              Activités
            </div>
          </div>
     
      </div>
      <div className='bottomIcon'>
        <div className={`logout ${buttonStyles('deconnexionIcone2')}`} onClick={() => handleClick('deconnexionIcone')}>
          <div className={`bottomIcon2 ${buttonStyles('deconnexionIcone2')}`}>
            <DeconnexionIcone2 className={`deconnexion-icone2 ${buttonStyles('deconnexionIcone2')}`} />
          </div>
          <div className={`dconnexion valign-text-middle ${buttonStyles('deconnexionIcone2')}`} onClick={() => handleClick('deconnexionIcone')}>
            Déconnexion
          </div>
        </div>

        <div className={`settings ${buttonStyles('parametresIcon2')}`} onClick={() => handleClick('parametresIcon2')}>
          <div className={`bottomIcon1 ${buttonStyles('parametresIcon2')}`}>
            <ParametresIcon2 className={`parametres-icon2 ${buttonStyles('parametresIcon2')}`} />
          </div>
          <div className={`paramtres valign-text-middle ${buttonStyles('parametresIcon2')}`} onClick={() => handleClick('parametresIcon2')}>
            Paramètres
          </div>
        </div>
      </div>
      <div className='colomn2'>  
      </div>
      <div className='bottomColomn2'>      
      </div>
    </div>
  );
};

export default ExtendedSidebar;