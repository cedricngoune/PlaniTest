import React from 'react';
import styles from './Calendar.module.css';
import datas from '../../datas/appointements.json';
import { Appointment, TimeLine } from "../../components";
import { countOverlapByAppointment, sortByDuration } from "../../services/calendar.service";
import { AppointmentModel } from "../../classes/appointment";
import styled from "styled-components";

const Appointements = styled.div.attrs({className: styles.appointments})`
  grid-template-columns: repeat(${props => props.maxColumn - 1}, 1fr);
`;

const Calendar = () => {
  const APPOINTMENTS = datas.map(d => new AppointmentModel(d.id, d.start, d.duration));
  APPOINTMENTS.sort(sortByDuration);
  const overlapsByAppointment = countOverlapByAppointment(APPOINTMENTS);
  const maxColumn = Math.max(...overlapsByAppointment);

  const createAppointmentJSX = (appointment, index) => {
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        start={appointment.start+1}
        end={appointment.end+1}
        span={overlapsByAppointment[index]}
        maxColumn={maxColumn} />
    );
  }

  return (
   <main className={styles.calendar}>
     <TimeLine />
     <Appointements maxColumn={maxColumn}>
         {
           APPOINTMENTS.map(createAppointmentJSX)
         }
     </Appointements>
   </main>
  );
}

export default Calendar;