export class Loader {
  constructor(
    public loading: boolean = false,
    public started: boolean = false,
    public complete: boolean = false
  ) {}
}
export const userRoles = {
  admin: '1',
  user: '2',
  employer: '3',
};
