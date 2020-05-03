import { openDB, IDBPDatabase } from 'idb';
import { TimeregDB } from './TimeregDB';
import { TimeRegistration } from './models/timeRegistration';

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

  constructor() {
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
      await this.db.put('registrations', registration);
    } else {
      await this.db.add('registrations', {
        date: registration.date,
        hours: registration.hours,
        timeFrom: registration.timeFrom,
        timeTo: registration.timeTo,
        description: registration.description,
        project: registration.project,
        serverId: registration.serverId
      });
    }
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
