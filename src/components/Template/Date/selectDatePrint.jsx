import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import 'moment/locale/fr';
import { fr } from 'date-fns/locale';
import './selectDate.css';
import CalendarIcon from './akar-icons_calendar.svg'

export default function ComponentDate({ selectedDatePrint, setSelectedDatePrint, isOpen, setIsOpen, }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [selected, setSelected] = useState(tomorrow);
  const [calendarIconStyle, setCalendarIconStyle] = useState({});

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelect = (date) => {
    // Vérifiez si la date sélectionnée est définie et est la même que la date précédemment sélectionnée
    if (date && selected && date.getTime() === selected.getTime()) {
      // Si c'est le cas, ignorez la sélection
      setIsOpen(false);
      return;
    }

    if(date) {
      const newDate = new Date(date);
      setSelected(newDate); // Utilisation de new Date() pour assurer la conversion en objet Date
      setSelectedDatePrint(newDate); // Mettre à jour l'état dans le composant parent
    }
    setIsOpen(false);
  };

  const handleDateInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCalendarIconStyle({ top: '221px' }); // ou toute autre valeur qui convient à votre design
    } else {
      setCalendarIconStyle({ top: '228px' });
    }
  }, [isOpen]);

  return (
    <div className='inputDateContainer'>
      <style>{`.rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
        background-color: var(--midnight-blue)}`}</style>
        <div className='inputDate'>
      <div className='calendarLine'>
        <label className='labelDate'>Date*</label>
        <input
          type="text"
          className={`dateRdv ${selected ? 'selected' : ''}`}
          value={moment(selected).format('LL')}
          onClick={handleInputClick}
          onKeyDown={handleDateInputKeyDown}
          readOnly
        />
        </div>
        <img src={CalendarIcon} style={calendarIconStyle} alt='CalendarIcon' className='calendarIconPrint' onClick={handleInputClick}/>
      </div>
      {isOpen && (
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          locale={fr}
        />
      )}
    </div>
  );
}  



