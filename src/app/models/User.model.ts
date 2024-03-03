export interface User {
    id: string;
    name: string;
    last_name: string;
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
}

export interface Employee { 
    id?: string;
    jobPosition?: string; 
    hourlyRate?: number; 
    daysOfWeek?: string[]; 
    startTime?: string; 
    endTime?: string; 
}