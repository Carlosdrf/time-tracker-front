export interface User {
    id: string;
    name: string;
    last_name: string;
    profile: any;
    email: string;
    password: string;
    role: number;
    company: Company;
    employee: Employee;
}

export interface Company{
    id?: string;
    name?: string;
    description?: string;
    timezone?: string;
    countryName?: string;
}

export interface Employee { 
    id?: string;
    position?: string; 
    hourlyRate?: number; 
    daysOfWeek?: string[]; 
    startTime?: string; 
    endTime?: string; 
}