import React, { useRef, useEffect, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import timeGridPlugin from '@fullcalendar/timegrid';
import './fullCalendar.css';
import frLocale from '@fullcalendar/core/locales/fr';
import FullCalendar from '@fullcalendar/react';
import { decodeToken } from "react-jwt";

const Calendar = ({ events }) => {
  const [userType, setUserType] = useState(null);
  const calendarRef = useRef(null);
  const slotMinTime = '08:00'; // Heure de début souhaitée (7h du matin)
  const slotMaxTime = '22:00'; // Heure de fin souhaitée (23h le soir)
  const slotDuration = '00:05:00';

  const handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr);
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = decodeToken(token);
      const fetchedUserType = `${decodedToken.userType}`;
      return fetchedUserType; // retourne le userType
    } catch (error) {
      console.error("Error fetching user:", error);
      return null; // retourne null en cas d'erreur
    }
  };

  

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      events.forEach(event => {
        calendarApi.addEvent(event);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef.current, events]);

  useEffect(() => {
    const fetchAndSetUserType = async () => {
      const fetchedUserType = await fetchUser();
      setUserType(fetchedUserType);
    };
  
    fetchAndSetUserType();
  }, []);



  if (userType === 'psychiatre') {
    return (
      <FullCalendar 
        ref={calendarRef}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        headerToolbar={{
          left: 'prev,next title today',
          center: '',
          right: 'timeGridDay,timeGridWeek'
        }}
        initialView='timeGridWeek'
        dateClick={handleDateClick}
        locale={frLocale}
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        slotDuration={slotDuration}
        eventContent={renderEventContent} // utilisez la fonction personnalisée pour rendre le contenu de l'événement
      />
    );
  }

  // Retour par défaut si userType n'est pas 'psychiatre'
  return null;
}

function renderEventContent(eventInfo) {
  return (
    <div className='event'>
      <b>{eventInfo.timeText}</b>
      <br />
      {eventInfo.event.title}
    </div>
  );
}

export default Calendar;
