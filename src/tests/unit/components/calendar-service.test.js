import React from 'react';
import datas from '../../../datas/appointements.json';
import {
  generateEndDateInMinutes, countOverlapByAppointment, isNextTimeBetweenLowerLimit,
  isNextTimeBetweenStartEnd, isNextTimeBetweenUpperLimit, isNextTimeEvenCurrentTime,
  parseHoursInMinutes,
  parseStringHoursIntoNumber, sortByDuration
} from "../../../services/calendar.service";
import {AppointmentModel} from "../../../classes/appointment";

let copyAppointements;
const MIN_HOUR = 9;

beforeEach(async () => {
  copyAppointements = datas.map(d => new AppointmentModel(d.id, d.start, d.duration));
})

test("Datas length", () => {
  expect(copyAppointements.length).toEqual(17);
});

test("Parse String Hours Into Number", () => {
  let result = parseStringHoursIntoNumber("18:45");
  expect(result).toEqual([18, 45]);
});

test("Parse Hours In Minutes", () => {
  let result = parseHoursInMinutes("18:45");
  expect(result).toEqual(117);

  const appointment = copyAppointements[0];
  expect(appointment.stringStart).toEqual("17:00");
  result = parseHoursInMinutes(appointment.stringStart);
  expect(result).toEqual(96);
});

test("Generate End Date In Minute", () => {
  let durationInMinute = 60;
  let minutes_step_by_hours = 5;
  let fivePMInMinutes = (17 - MIN_HOUR) * (60 / minutes_step_by_hours);
  let result = generateEndDateInMinutes(fivePMInMinutes, durationInMinute, minutes_step_by_hours);
  expect(result).toEqual(108);

  durationInMinute = 60;
  minutes_step_by_hours = 1;
  fivePMInMinutes = (17 - MIN_HOUR) * (60 / minutes_step_by_hours);
  result = generateEndDateInMinutes(fivePMInMinutes, durationInMinute, minutes_step_by_hours);
  expect(result).toEqual(540);
});

test('is Next Start Between Start End Method', () => {
  /**
   * Testing jf next Start Time (7:40pm) is between (5pm to 6pm)
   * Should be False
   * */
  const appointment = copyAppointements[1];
  let nextAppointment = copyAppointements[2];
  expect(appointment.id).toEqual(2);
  expect(nextAppointment.id).toEqual(3);

  let isBetween = isNextTimeBetweenStartEnd(nextAppointment.start, appointment.start, appointment.end);
  expect(isBetween).toBeFalsy();

  /**
   * Testing jf Next Start Time (6pm) is between (5pm to 7pm)
   * Should be True
   * */
  nextAppointment = copyAppointements[4];
  expect(nextAppointment.id).toEqual(5);

  isBetween = isNextTimeBetweenStartEnd(nextAppointment.start, appointment.start, appointment.end);
  expect(isBetween).toBeTruthy();
});

test('is Next End Between Start End Method', () => {
  /**
   * Testing jf next end time (7:40pm) is between (5pm to 7pm)
   * Should be False
   * */
  let appointment = copyAppointements[1];
  let nextAppointment = copyAppointements[2];
  expect(appointment.id).toEqual(2);
  expect(nextAppointment.id).toEqual(3);

  let isBetween = isNextTimeBetweenStartEnd(nextAppointment.end, appointment.start, appointment.end);
  expect(isBetween).toBeFalsy();

  /**
   * Testing jf next end time (6pm) is between (5pm to 7pm)
   * Should be True
   * */
  nextAppointment = copyAppointements[0];

  isBetween = isNextTimeBetweenStartEnd(nextAppointment.end, appointment.start, appointment.end);
  expect(isBetween).toBeTruthy();
});

test('is Next Time Between Upper Limit Method', () => {
  /**
   * Testing jf end time (2:30pm) is between next time (5pm to 7pm)
   * Should be False
   * */
  let appointment = copyAppointements[12];
  let nextAppointment = copyAppointements[0];
  expect(appointment.id).toEqual(13);
  expect(nextAppointment.id).toEqual(1);

  let isBetween = isNextTimeBetweenUpperLimit(nextAppointment.start, nextAppointment.end, appointment.end);
  expect(isBetween).toBeFalsy();

  /**
   * Testing jf end time (3:45pm) is between next time (5pm to 7pm)
   * Should be False
   * */
  nextAppointment = copyAppointements[1];
  expect(nextAppointment.id).toEqual(2);

  isBetween = isNextTimeBetweenUpperLimit(nextAppointment.start, nextAppointment.end, appointment.end);
  expect(isBetween).toBeFalsy();


  /**
   * Testing jf end time (6pm) is between next time (5pm to 7pm)
   * Should be False
   * */
  appointment = copyAppointements[0];
  nextAppointment = copyAppointements[1];
  expect(appointment.id).toEqual(1);
  expect(nextAppointment.id).toEqual(2);

  isBetween = isNextTimeBetweenUpperLimit(nextAppointment.start, nextAppointment.end, appointment.end);
  expect(isBetween).toBeTruthy();
});

test('is Next Time Between Lower Limit Method', () => {
  /**
   * Testing jf start time (2pm) is between next time (11:40pm to 12:20pm)
   * Should be False
   * */
  let appointment = copyAppointements[16];
  let nextAppointment = copyAppointements[15];
  expect(appointment.id).toEqual(17);
  expect(nextAppointment.id).toEqual(16);

  let isBetween = isNextTimeBetweenLowerLimit(
    nextAppointment.start, nextAppointment.end, appointment.start
  );
  expect(isBetween).toBeFalsy();

  /**
   * Testing jf start time (11:50 pm) is between next time (11:40pm to 12:20pm)
   * Should be False
   * */
  appointment = copyAppointements[14];
  nextAppointment = copyAppointements[15];
  expect(appointment.id).toEqual(15);
  expect(nextAppointment.id).toEqual(16);

  isBetween = isNextTimeBetweenLowerLimit(nextAppointment.start, nextAppointment.end, appointment.start);
  expect(isBetween).toBeTruthy();
});

test('is Next Time Equal Current Time Method', () => {
  /**
   * Testing jf start time (5pm to 6pm) is equal to next time (5pm to 18pm)
   * Should be False
   * */
  let appointment = copyAppointements[0];
  let nextAppointment = copyAppointements[1];
  expect(appointment.id).toEqual(1);
  expect(nextAppointment.id).toEqual(2);

  let isBetween = isNextTimeEvenCurrentTime(
    nextAppointment.start, nextAppointment.end, appointment.start, appointment.end
  );
  expect(isBetween).toBeFalsy();

  /**
   * Testing jf start time (5pm to 6pm) is equal to next time (5pm to 6pm)
   * Should be False
   * */
  appointment = copyAppointements[0];
  nextAppointment = copyAppointements[7];
  expect(appointment.id).toEqual(1);
  expect(nextAppointment.id).toEqual(8);

  isBetween = isNextTimeEvenCurrentTime(
    nextAppointment.start, nextAppointment.end, appointment.start, appointment.end
  );
  expect(isBetween).toBeTruthy();
});

test('Sort By Duration', () => {
  expect(copyAppointements[0].duration).toEqual(60);
  expect(copyAppointements[1].duration).toEqual(120);
  expect(copyAppointements[2].duration).toEqual(10);

  copyAppointements.sort(sortByDuration);
  expect(copyAppointements[0].duration).toEqual(10);
  expect(copyAppointements[1].duration).toEqual(10);
  expect(copyAppointements[2].duration).toEqual(20);

});

test('Get Overlap Count By Hour', () => {
  const overlaps = countOverlapByAppointment(copyAppointements);
  expect(overlaps[0]).toEqual(3);
  expect(overlaps[1]).toEqual(4);
  expect(overlaps[2]).toEqual(2);
  expect(overlaps[3]).toEqual(2);
  expect(overlaps[4]).toEqual(2);
  expect(overlaps[5]).toEqual(3);
  expect(overlaps[6]).toEqual(2);
  expect(overlaps[7]).toEqual(3);
  expect(overlaps[8]).toEqual(2);
  expect(overlaps[9]).toEqual(3);
  expect(overlaps[10]).toEqual(3);
  expect(overlaps[11]).toEqual(1);
  expect(overlaps[12]).toEqual(2);
  expect(overlaps[13]).toEqual(2);
  expect(overlaps[14]).toEqual(3);
  expect(overlaps[15]).toEqual(3);
  expect(overlaps[16]).toEqual(1);
});