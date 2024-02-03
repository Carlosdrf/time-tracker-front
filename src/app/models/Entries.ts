export interface Entries {
  status?: number;
  task?: string;
  start_time?: Date;
  end_time?: Date;
  date?: Date;
  description?: string;
}

export class Entry {
  status: any = null;
  timeRef!: any;
  started: string = '';
  totalHours: string = "";
}
