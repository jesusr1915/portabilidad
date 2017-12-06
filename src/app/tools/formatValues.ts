import { Injectable } from '@angular/core';

@Injectable()
export class FormatValue {
    formatDate(date:string, divider:string, format:string){
      if(format == "aammdd"){
        let values = date.split(divider, 3);
        let index = parseInt(values[1])-1;
        let month = ["Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"];
        return (values[2]+" "+month[index]+" "+values[0]);
      }else if(format == "ddmmaa"){
        let values = date.split(divider, 3);
        let index = parseInt(values[1])-1;
        let month = ["Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"];
        return (values[0]+" "+month[index]+" "+values[2]);
      }
      return ("");
    }
}
