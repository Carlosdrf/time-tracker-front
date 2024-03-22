export interface User {
    id: string;
    name: string;
    last_name: string;
    profile: any;
    email: string;
    password: string;
    role: number;
    company: Company;
    employee: Company
    // {
    //     name?: string;
    //     description?: string
    // }
}

export interface Company{
    id?: string;
    name?: string;
    description?: string;
}