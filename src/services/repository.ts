import { openDB, IDBPDatabase } from 'idb';
import { TimeRegistration } from '../models/timeRegistration';
import { DBSchema } from "idb";

interface TimeregDB extends DBSchema {
  registrations: {
    value: TimeRegistration,
    key: number
  }
}

export class Repository {
  private static _current : Repository;
  public static async getCurrent() {
    if (!this._current){
      this._current = new Repository();
      await this._current.initialize();
    }
    return this._current;
  }

  private db! : IDBPDatabase<TimeregDB>;

  private constructor() {
  }

  /**
   * initialize
   */
  public async initialize() {
    console.log('initializing repo')
    this.db = await openDB<TimeregDB>('timeRegistrations', 1, {
      upgrade (db) {
        db.createObjectStore('registrations',{
          keyPath: 'id',
          autoIncrement: true
        });
      }
    });
  }

  /**
   * updateRegistration
   */
  public async updateRegistration(registration : TimeRegistration) {
    if (registration.id) {
      return await this.db.put('registrations', registration);
    } else {
      return await this.db.add('registrations', {
        date: registration.date,
        hours: registration.hours,
        timeFrom: registration.timeFrom,
        timeTo: registration.timeTo,
        description: registration.description,
        project: registration.project
      });
    }
  }

  public async remove(id: number) {
    await this.db.delete('registrations', id);
  }

  /**
   * getRegistrations
   */
  public async getRegistrations() : Promise<TimeRegistration[]> {
    return await this.db
      .getAll('registrations')
      .then(data => data.sort((timereg1, timereg2) => (timereg2.date.getTime() - timereg1.date.getTime())));
  }

  /**
   * getRegistrationsByDate
   */
  public async getRegistrationsByDate(date : Date) {
    const registrations =
      await this.db
        .getAll('registrations');

    return registrations.filter(x => x.date.toDateString() === date.toDateString());
  }

  /**
   * getRegistration
   */
  public async getRegistration(id: number) {
    return await this.db.get('registrations', id);
  }
}