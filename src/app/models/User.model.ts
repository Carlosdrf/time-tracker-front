// export class User {
//   constructor(
//     public id: string = '',
//     public name: string = '',
//     public last_name: string = '',
//     public profile: any,
//     public email: string = '',
//     public password: string = '',
//     public role: number = 0,
//     public company?: Company | null,
//     public employee?: Employee | null,
//     public active?: number
//   ) {}
// }

export interface User {
  id: string;
  name: string;
  last_name: string;
  profile?: any;
  email: string;
  password: string;
  role: number;
  active: number;
  company?: Company;
  schedule?: Schedule;
  employee?: Employee | undefined;
}

export interface Company {
  id: string;
  name?: string;
  description?: string;
  timezone?: string;
  countryName?: string;
}

export interface Employee {
  id: string;
  position?: string;
  hourly_rate?: number;
  schedule?: Schedule[];
}

export interface Schedule {
  days: string[];
  start_time: string;
  end_time: string;
}
