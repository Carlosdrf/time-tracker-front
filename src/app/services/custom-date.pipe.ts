import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
// import { DashboardComponent } from "../components/dashboard/dashboard.component";

@Pipe({
    name: 'customDate'
})

export class CustomDatePipe implements PipeTransform{
    transform(value: Date, format: string = 'DD-MM-YYYY HH:mm:ss'): string {
        return moment(value).format(format);
    }
}

