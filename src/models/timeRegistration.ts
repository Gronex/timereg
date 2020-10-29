export interface TimeRegistration {
    id? : number;
    date : Date;
    project? : string;
    description? : string;
    hours : number;
    timeFrom : number;
    timeTo : number;
  }