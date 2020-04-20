import { DBSchema } from "idb";
import { TimeRegistration } from './models/timeRegistration';

export interface TimeregDB extends DBSchema {
  registrations: {
    value: TimeRegistration & {
      id: string;
    },
    key: string,
    indexes: { 'by-date': Date }
  }
}
