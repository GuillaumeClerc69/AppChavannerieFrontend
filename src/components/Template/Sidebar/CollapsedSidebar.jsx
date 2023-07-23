import React from 'react';
import { ReactComponent as ParametresIcon } from './parametresIcon.svg';
import { ReactComponent as DeconnexionIcone } from  './ic_round-log-out.svg';
import { ReactComponent as CalendarIcon } from './akar-icons_calendar.svg';
import { ReactComponent as IconFile } from './iconFile.svg';
import { ReactComponent as LogoActivites } from './iconoir_yoga.svg';
import logoMiniClinea from './logoBuble.svg';

function CollapsedSidebar({ handleClick, buttonStyles, sidebarExtended }) {
  return (
    <div className={`bg ${sidebarExtended ? 'sidebar-extended' : 'sidebar-collapsed'}`}>
      <img className="logo-clinea" src={logoMiniClinea} alt="logo-clinea" />
      <div className='columnIcon'>
          <div className={`planning ${buttonStyles('calendar')}`} onClick={() => handleClick('calendar')}>
            <div className="logo-calendar-select">
              <CalendarIcon className="calendar" />
            </div>
          </div>
          <div className={`iconfile ${buttonStyles('iconFile')}`} onClick={() => handleClick('iconFile')}>
            <IconFile className="icon-file" />
          </div>
          <div className={`logo-activites ${buttonStyles('logoActivites')}`} onClick={() => handleClick('logoActivites')}>
            <LogoActivites className="logo-activities" />
          </div>
        </div>
        <div className='bottomIcon'>
          <div className={`bottomIcon2 ${buttonStyles('deconnexionIcone')}`} onClick={() => handleClick('deconnexionIcone')}>
            <DeconnexionIcone className="deconnexion-icone" />
          </div>
          <div className={`bottomIcon1 ${buttonStyles('parametresIcon')}`} onClick={() => handleClick('parametresIcon')}>
            <ParametresIcon className="parametres-icon" />
          </div>
        </div>
    </div>
  );
}

export default CollapsedSidebar;
