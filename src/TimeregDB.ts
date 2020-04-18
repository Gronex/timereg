import { DBSchema } from "idb";

export interface TimeregDB extends DBSchema {
  registrations: {
    value: {
      date: Date;
      description: string;
      id: string;
    },
    key: string,
    indexes: { 'by-date': Date }
  }
}
