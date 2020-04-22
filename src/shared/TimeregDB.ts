import { DBSchema } from "idb";
import { TimeRegistration } from './models/timeRegistration';

export interface TimeregDB extends DBSchema {
  registrations: {
    value: TimeRegistration,
    key: number
  }
}
