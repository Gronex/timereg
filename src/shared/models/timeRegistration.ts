export interface TimeRegistration {
  id? : number;
  serverId? : string;
  date : Date;
  project? : string;
  description? : string;
  hours : number;
  timeFrom : number;
  timeTo : number;
}
