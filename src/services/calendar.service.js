export const MINUTE_STEP_PER_HOUR = 5;
export const MIN_HOUR = 9;

export const parseStringHoursIntoNumber = (hourStr) => {
  return hourStr.split(":").map((elt) => parseInt(elt));
}

export const generateEndDateInMinutes = (startInMinute, duration, minute_step=MINUTE_STEP_PER_HOUR) => {
  return startInMinute + duration / minute_step;
}

export const parseHoursInMinutes = (hourStr, minute_step=MINUTE_STEP_PER_HOUR) => {
  const [hours, minutes] = parseStringHoursIntoNumber(hourStr);
  const minuteInHours = 60 / minute_step;
  return Math.round((hours - MIN_HOUR) * minuteInHours + minutes / minute_step);
}

export const isNextTimeBetweenStartEnd = (nextTime, currentStart, currentEnd) => {
  return nextTime > currentStart && nextTime < currentEnd;
}

export const isNextTimeBetweenUpperLimit = (nextStart, nextEnd, currentEnd) => {
  return nextEnd > currentEnd && nextStart < currentEnd;
}

export const isNextTimeBetweenLowerLimit = (nextStart, nextEnd, currentStart) => {
  return nextEnd > currentStart && nextStart < currentStart;
}

export const isNextTimeEvenCurrentTime = (nextStart, nextEnd, currentStart, currentEnd) => {
  return nextStart === currentStart && nextEnd === currentEnd;
}

/**
 *  Sort Appointements by duration, to have a better visual effect and keep on the right of column
 *  the biggest overlaps. therefore, other appointements can spread out freely.
 * */
export const sortByDuration = (appointment, nextAppointment) => {
  return appointment.duration - nextAppointment.duration;
}

/**
 *  count overlaps by appointements
 * */
export const countOverlapByAppointment = (appointements) => {
  const overlapsByAppointment = [];
  let overlapsCounter = 0;
  for(let i = 0; i < appointements.length; i++) {
    const appointment = appointements[i];
    for (let j = 0;  j < appointements.length; j++) {
      const nextAppointment = appointements[j];
      if (isNextTimeBetweenStartEnd(nextAppointment.start, appointment.start, appointment.end)) {
        overlapsCounter++;
      } else if (isNextTimeBetweenStartEnd(nextAppointment.end, appointment.start, appointment.end)) {
        overlapsCounter++;
      } else if (isNextTimeBetweenUpperLimit(nextAppointment.start, nextAppointment.end, appointment.end)) {
        overlapsCounter++;
      } else if (isNextTimeBetweenLowerLimit(nextAppointment.start, nextAppointment.end, appointment.start)) {
        overlapsCounter++;
      }else if (isNextTimeEvenCurrentTime(
        nextAppointment.start, nextAppointment.end, appointment.start, appointment.end
      )) {
        overlapsCounter++;
      }
    }
    overlapsByAppointment.push(overlapsCounter);
    overlapsCounter = 0;
  }
  return overlapsByAppointment;
}