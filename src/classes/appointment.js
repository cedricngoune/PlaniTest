import { generateEndDateInMinutes, parseHoursInMinutes } from "../services/calendar.service";

export class AppointmentModel {
  constructor(id, start, duration) {
    this.id = id;
    this.duration = duration;
    this.stringStart = start;
    this.start = parseHoursInMinutes(start);
    this.end = generateEndDateInMinutes(this.start, duration);
  }
}