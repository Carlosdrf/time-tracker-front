export interface User {
    name: string;
    last_name: string;
    email: string;
    password: string;
    role: number;
    company: Company;
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