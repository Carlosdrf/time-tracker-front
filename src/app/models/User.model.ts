export class User {
  constructor(
    public id: string = '',
    public name: string = '',
    public last_name: string = '',
    public profile: any,
    public email: string = '',
    public password: string = '',
    public role: number = 0,
    public company: Company,
    public employee: Employee,
    public active?: number,
    ) {}
}

export class Company {
  id?: string;
  name?: string;
  description?: string;
  timezone?: string;
  countryName?: string;
}

export class Employee {
  id: string = '';
  position?: string;
  hourly_rate?: number;
  daysOfWeek?: string[];
  startTime?: string;
  endTime?: string;
}
