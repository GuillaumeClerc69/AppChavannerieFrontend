import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';


export default function DigitalClockAmPm({ onChange, minTime }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoItem>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock 
                defaultValue={dayjs('2022-04-17T09:30')} 
                ampm={false} 
                skipDisabled
                minTime={dayjs(minTime, 'HH:mm')} // Utiliser minTime pour définir l'heure minimale
                maxTime={dayjs('2022-04-17T21:00')}
                timeStep={5}
                onChange={onChange} // Passer la fonction de rappel à DigitalClock
              />
            </DemoItem>
            <DemoItem>
            </DemoItem>
          </DemoContainer>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
