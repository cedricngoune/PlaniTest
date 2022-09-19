import React from "react";
import styled from "styled-components";
import styles from './Appointment.module.css';

const ColumnItem = styled.div.attrs({className: styles.appointment})`
  grid-column: span ${props => Math.floor(props.maxColumn / props.span)};
  grid-row: ${props => props.start} / ${props => props.end};
`;

const Appointment = ({ id, start, end, span, maxColumn}) => {
  return (
    <ColumnItem start={start} end={end} span={span} maxColumn={maxColumn}>
      <p>{id}</p>
    </ColumnItem>
  );
}

export default Appointment;