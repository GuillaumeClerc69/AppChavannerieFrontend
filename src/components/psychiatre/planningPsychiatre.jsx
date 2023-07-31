import React, { useState, useEffect, useRef } from "react";
import x61 from './loupe.png';
import './planningPsychiatre.css';
import Calendar from '../Template/Calendar/fullCalendar';
import axios from "axios";
import closePopup from './closePopUp.svg';
import Select from 'react-select';
import { decodeToken } from "react-jwt";
import ComponentDate from '../Template/Date/selectDate';
import DigitalClockAmPm from '../Template/Time/selectTime'
import clockIcon from './clockIcone.svg';
import { useOutsideAlerter } from './useOutsideAlerter';
import printButton from './btn_print.svg'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import logoClinea from './logo-clinea.png'
import ComponentDatePrintPopup from "../Template/Date/selectDatePrint";
import moment from 'moment';
import 'moment/locale/fr';
import dayjs from 'dayjs';

function PsychiatreCalendar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedHour, setSelectedHour] = useState('');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const timePickerRef = useRef(null);
  const [selectedStartHour, setSelectedStartHour] = useState('');
  const [selectedEndHour, setSelectedEndHour] = useState('');
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const startPickerRef = useRef(null); // Créez une référence pour le sélecteur de début
  const endPickerRef = useRef(null); // Créez une référence pour le sélecteur de fin
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [addEvent, setAddEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [selectedDatePrint, setSelectedDatePrint] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [events, setEvents] = useState([]);
  const [isPrintPopupOpen, setIsPrintPopupOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [popupHeight, setPopupHeight] = useState('initial');
  const [buttonStyle, setButtonStyle] = useState({});

  console.log(selectedDate)

  // Utilisez le hook personnalisé pour fermer le sélecteur de début lorsqu'un clic est effectué en dehors
  useOutsideAlerter(startPickerRef, () => setIsStartPickerOpen(false));

  // Utilisez le hook personnalisé pour fermer le sélecteur de fin lorsqu'un clic est effectué en dehors
  useOutsideAlerter(endPickerRef, () => setIsEndPickerOpen(false));

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/appointments`, {
        headers: {
          'x-auth-token': token
        }
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return []; // Retournez un tableau vide en cas d'erreur
    }
  };

  

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = decodeToken(token); // Use decodeToken here
      const doctorName = `${decodedToken.firstname} ${decodedToken.lastname}`; // Get the doctor's name from the decoded token
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/patients`, {
        headers: {
          'x-auth-token': token
        }
      });
  
      // Filter the patients based on the doctor's name
      const filteredPatients = response.data.filter(patient => patient.doctor === doctorName);
  
      setPatients(filteredPatients); // Set the filtered patients
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };


  const refreshPage = () => {
    window.location.reload();
  };
  
  // eslint-disable-next-line no-unused-vars
  const eventRender = (info) => {
    info.el.setAttribute('data-tooltip-id', 'my-tooltip');
    info.el.setAttribute('data-tooltip-content', `Patient: ${info.event.title}, Start: ${info.event.start}, End: ${info.event.end}`);
  };

  const loadAppointments = async () => {
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const doctorName = `${decodedToken.firstname} ${decodedToken.lastname}`;
    const appointments = await fetchAppointments();
  
    // eslint-disable-next-line array-callback-return
    const newEvents = appointments.map(appointment => {
      if (appointment.doctor === doctorName && appointment.appointmentType === 'medical') {
        return {
          title: `${appointment.patient}`,
          start: dayjs(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.startHour,
          end: dayjs(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.endHour,
          allDay: false,
          color: '#7FFFD4',
          textColor: '#4A42BC',
          location: appointment.location,
        };
      }
    });

    setEvents(newEvents);
  };
  
  const handlePrintPopupButtonClick = () => {
    setIsPrintPopupOpen(true)
  }
  
  
  const handlePrintButtonClick = () => {
    // Créez une nouvelle instance de jsPDF
    const doc = new jsPDF();
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const doctorName = `${decodedToken.firstname} ${decodedToken.lastname}`
    // Ajoutez le logo (vous devez avoir le logo en format base64 ou en tant que fichier externe)
    doc.addImage(logoClinea, 'PNG', 20, 20, 40, 15);
    
    // Ajoutez le titre
    doc.setFontSize(20);
    doc.text(`La Chavannerie`, 20, 60);
    doc.text(`${doctorName}`, 20, 70);
    doc.text(`${moment(selectedDatePrint).locale('fr').format('dddd')} ${moment(selectedDatePrint).locale('fr').format('LL')}`, 20, 80);

    const filteredAppointments = events.filter(event => {
    // Comparez les dates sans prendre en compte les heures
    const eventDate = moment(event.start).startOf('day');
    const selectedDate = moment(selectedDatePrint).startOf('day');
    return eventDate.isSame(selectedDate);
  });

     const appointments = filteredAppointments.map(event => {
      const startTime = dayjs(event.start).format('HH:mm'); // Formattez la date de début pour obtenir uniquement l'heure
      const [firstname, lastname] = event.title.split(' '); // Divisez le titre en prénom et nom de famille
      const patientName = `${firstname}.${lastname.charAt(0)}`; // Formatez le nom du patient
      const location = event.location; // Récupérez le lieu du rendez-vous
      return [startTime, patientName, location];
    });
  
    appointments.sort((a, b) => a[0].localeCompare(b[0]));
  
    autoTable(doc, {
      startY: 100,
      margin: { left: 20 }, // Définir la marge gauche à 20
      body: appointments,
      theme: 'grid', // Utiliser le thème 'grid' pour avoir des bordures
      styles: {
        cellPadding: 5, // Ajouter un padding aux cellules
        fontSize: 16,
        lineColor: [217, 217, 217], // Couleur des bordures en RGB (équivalent à #d9d9d9)
        lineWidth: 0.1, // Epaisseur des bordures
        fillColor: [229, 241, 255], // Couleur de fond des cellules en RGB (équivalent à #e5f1ff)
        width: 20,
        textColor: [21, 61, 124],
      },
      columnStyles: {
        0: {cellWidth: 56},
        1: {cellWidth: 56},
        2: {cellWidth: 56} // Définissez la largeur de la troisième colonne
      },
      head: [['Heure', 'Patient', 'Lieu']], // Ajoutez l'en-tête de la troisième colonne
    });
  
    // Ouvrez le PDF dans un nouvel onglet et lancez l'impression
    window.open(URL.createObjectURL(doc.output("blob")));
  };
  
  useEffect(() => {
  if (selectedStartHour) {
    const startHour = dayjs(selectedStartHour, 'HH:mm');
    const endHour = startHour.add(10, 'minute');
    setSelectedEndHour(endHour.format('HH:mm'));
  }
}, [selectedStartHour]);
  
  useEffect(() => {
    
    // Vérifiez si tous les champs du formulaire sont remplis
    if (selectedOption && selectedStartHour && selectedEndHour && selectedLocation && selectedDate) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedOption, selectedStartHour, selectedEndHour, selectedLocation, selectedDate]);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    loadAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  useEffect(() => {
    if (isTimePickerOpen) {
      const handleClickOutside = (event) => {
        if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
          setIsTimePickerOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimePickerOpen]);

  useEffect(() => {
    if (isOpen) {
      setPopupHeight('740px'); // ou toute autre valeur qui convient à votre design
    } else {
      setPopupHeight('443px');
    }
  }, [isOpen]);

  //déplacer bouton valider quand le calendrier est ouvert printpopup
  useEffect(() => {
    if (isOpen) {
      setButtonStyle({ marginTop: '360px' }); // ou toute autre valeur qui convient à votre design
    } else {
      setButtonStyle({ marginTop: '50px' });
    }
  }, [isOpen]);



  const handleButtonClick = async () => {
    // Créez un objet contenant toutes les données que vous souhaitez envoyer
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const appointmentData = {
      patient: selectedPatient,
      doctor: `${decodedToken.firstname} ${decodedToken.lastname}`, // Ajoutez le nom du médecin ici
      location: selectedLocation.value,
      startHour: selectedStartHour,
      endHour: selectedEndHour,
      date: selectedDate,
      appointmentType: 'medical' // Ajoutez le type de rendez-vous ici
    };
  
    try {
      // Send the data to the backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointments`, appointmentData, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
  
// Check if the POST request was successful
if (response.status === 200) {
  // Create an event object for FullCalendar
  const event = {
    title: selectedPatient,
    start: dayjs(selectedDate).format('YYYY-MM-DD') + 'T' + selectedStartHour,
    end: dayjs(selectedDate).format('YYYY-MM-DD') + 'T' + selectedEndHour,
    allDay: false
  };

  // Check that all event properties are defined
  if (event.title && event.start && event.end) {

    // Close the popup and reset the form state
    setIsPopupOpen(false);
    setSelectedPatient("");
    setSelectedLocation(null);
    setSelectedStartHour("");
    setSelectedEndHour("");
    setSelectedDate(null);

    // Refresh the page
    refreshPage();

  } else {
    console.error("Failed to create event:", event);
  }
  }
} catch (error) {
console.error("Error creating appointment:", error);
}
};
  

  
  const handleStartHourSelect = (value) => {
    setSelectedStartHour(value.format('HH:mm'));
    setIsStartPickerOpen(false); // Fermer le sélecteur d'heure
  };
  
const handleEndHourSelect = (value) => {
  if (value.isAfter(dayjs(selectedStartHour, 'HH:mm'))) {
    setSelectedEndHour(value.format('HH:mm'));
    setIsEndPickerOpen(false); // Fermer le sélecteur d'heure
  } else {
    alert('L\'heure de fin doit être supérieure à l\'heure de début');
  }
};

  const handleAddAppointment = () => {
    setIsPopupOpen(true);
  };

   

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // eslint-disable-next-line no-unused-vars
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  
  const LocationDropdown = ({ selectedLocation, setSelectedLocation }) => {
  
    const customStyles = {
      control: (provided) => ({
        ...provided,
        border: selectedLocation ? '2px solid #153D7C' : '1px solid #d9d9d9',
        width: 404,
        height: 56,
        borderRadius: 5,
        marginTop: 3,
        boxShadow: 'none',
        '&:hover': {
          border: '2px solid #153D7C',
        },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#153D7C' : state.isFocused ? '#CBE2FF' : null,
        color: state.isSelected ? '#FFFFFF' : 'black',
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: selectedLocation ? '#153D7C' : '#d9d9d9',
        backgroundColor: '#ffffff',
      }),
    };
  
    const handleLocationChange = (selectedOption) => {
      setSelectedLocation(selectedOption);
    };
  
    const options = [
      { value: 'Votre chambre', label: 'Votre chambre' },
      { value: 'Bureau de consultation', label: 'Bureau de consultation' }
    ];
  
    return (
      <div className="location-dropdown">
        <label htmlFor="location" className="locationLabel">Lieu*</label>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          id="location"
          placeholder="Sélectionnez un lieu"
          value={selectedLocation}
          onChange={handleLocationChange}
          options={options}
        />
      </div>
    );
  };
  

  const PatientSearch = () => {
    const patientOptions = patients.map((patient) => ({
      value: patient._id,
      label: `${patient.firstname} ${patient.lastname}`,
    }));
  
    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        border: selectedOption ? '2px solid #153D7C' : '1px solid #d9d9d9',
        width: 404,
        height: 56,
        borderRadius: 5,
        marginTop: 3,
        boxShadow: 'none',
        '&:hover': {
          border: '2px solid #153D7C',
        },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#153D7C' : state.isFocused ? '#CBE2FF' : null,
        color: state.isSelected ? '#FFFFFF' : 'black',
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        color: selectedOption ? '#153D7C' : '#d9d9d9',
        backgroundColor: '#ffffff'
      }),
    };
  
    const handlePatientChange = (selectedOption) => {
      setSelectedOption(selectedOption); // Update selectedOption state
      setSelectedPatient(selectedOption ? selectedOption.label : ""); // Update selectedPatient state with the label of the selected option
    };
  
    return (
      <div className="patient-search">
        <label htmlFor="patient-select" className="labelSearchPatient">Rechercher un patient*</label>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          id="patient-select"
          options={patientOptions}
          isSearchable
          placeholder="Sélectionnez un patient"
          value={selectedOption} // Use selectedOption state here
          onChange={handlePatientChange}
        />
      </div>
    );
  };
  



  return (
    <div className={isPopupOpen ? 'popup-open' : ''}>
      <div className="mainMenuCalendar">
        <div className="fullCalendar">
          <div className="topOfTheCalendar">
            <div className="firstLine">
              <h1 className="titlePsychiatre">Planning</h1>
              <div>
                <div className="btn_crer" onClick={handleAddAppointment}>
                  <div className="ajouter-un-rdv valign-text-middle">
                    Ajouter un RDV
                  </div>
                </div>
              </div>
              <div className="search-tool-psy">
                <input
                  className="rechercher-un-patient-ou-une-date poppins-normal-cadet-blue-14px"
                  name="rechercherunpatientouunedate"
                  placeholder="Rechercher un patient ou une date..."
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <img className="loupe" src={x61} alt="Loupe" />
              </div>
              
            </div>
            <div className="legende">
              <div className="absence">
              </div>
              <div className="schedule">
                <div className="rond-vert"></div>
                <div className="rdv-mdical poppins-normal-black-12px">
                  RDV Patient
                </div>
              </div>
            </div>
               <button className="printBtn" onClick={handlePrintPopupButtonClick}>
                  <img src={printButton} alt="printButton"></img>
                </button>
                {isPrintPopupOpen && <div className="overlay" onClick={() => setIsPrintPopupOpen(false)}></div>}
                {isPrintPopupOpen && (
                <div className={`print-pop-up`} style={{ height: popupHeight }} onClick={(e) => e.stopPropagation()}>
                  <img className="close-pop-up" src={closePopup} alt="closePopUp" onClick={() => setIsPrintPopupOpen(false)} />
                  <h1 className="titlePrintPopup">Impression fiche quotidienne</h1>
                 { <ComponentDatePrintPopup selectedDatePrint={selectedDatePrint} setSelectedDatePrint={setSelectedDatePrint} isOpen={isOpen} setIsOpen={setIsOpen}/>}
                 
                  <button className="btn-valider-print" style={buttonStyle} onClick={handlePrintButtonClick}>
                    <div className="validate valign-text-middlepoppins-bold-white-13px">
                      Valider
                    </div>
                  </button>

                </div>
)}

          </div>
        </div>
        <div className="bottomOfTheCalendar">
          <div className="fullPlanning">
            <Calendar 
              onEventAdded={setAddEvent} 
              events={events}
              />
            

            {isPopupOpen && <div className="overlay" onClick={() => setIsPopupOpen(false)}></div>}
            {isPopupOpen && (
              <div className="pop-up" onClick={(e) => e.stopPropagation()}>
                <img className="close-pop-up" src={closePopup} alt="closePopUp" onClick={() => setIsPopupOpen(false)} />
                <h1 className="title-rdv">Nouveau rendez-vous</h1>
                <div className="date-rdv">
                  <ComponentDate selectedDate={selectedDate} setSelectedDate={setSelectedDate} isOpen={isOpen} setIsOpen={setIsOpen}/>
                </div>
                
                <div className="overlap-group-container">
                  
                <div className="inputHour1" ref={startPickerRef}>
                  <label className="labelBeginHour">Heure de début*</label>
                  <input type="time" className={`hourRdv ${selectedStartHour ? 'selected' : ''}`} id="hourRdv1" value={selectedStartHour}
                  onChange={(e) => handleStartHourSelect(dayjs(e.target.value, 'HH:mm'))}/>
                  <img className="clockIcon" src={clockIcon} onClick={() => setIsStartPickerOpen(!isStartPickerOpen)} alt="clockIcon"></img>
                  {isStartPickerOpen && <div className="setTime"><DigitalClockAmPm onChange={handleStartHourSelect} /></div>}
                </div>

                <div className="inputHour2" ref={endPickerRef}>
                  <label className="labelEndHour">Heure de fin*</label>
                  <input type="time" className={`hourRdv2 ${selectedEndHour ? 'selected' : ''}`} value={selectedEndHour}
                  onChange={(e) => handleEndHourSelect(dayjs(e.target.value, 'HH:mm'))} />
                  <img className="clockIcon2" src={clockIcon} onClick={() => setIsEndPickerOpen(!isEndPickerOpen)} alt="clockIcon"></img>
                  {isEndPickerOpen && <div className="setTime2"><DigitalClockAmPm onChange={handleEndHourSelect} minTime={selectedStartHour} />
                </div>}
              </div>
            </div>
                <div>
                  <div className="locationContainer">
                  <LocationDropdown selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
                  </div>
                </div>
                <div className="patient-user">
                  <PatientSearch />
                </div>
                <button className="btn-valider-rdv" onClick={handleButtonClick} disabled={!isFormValid}>
                  <div className="validate valign-text-middlepoppins-bold-white-13px">
                    Valider
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}  

export default PsychiatreCalendar;
