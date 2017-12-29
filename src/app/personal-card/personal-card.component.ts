import { Component, OnInit, } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { InfoCardMan, messageInfoCard } from '../personal-card/infoCardMng';

@Component({
  selector: 'app-personal-card',
  templateUrl: './personal-card.component.html',
  styleUrls: ['./personal-card.component.scss']
})
export class PersonalCardComponent implements OnInit {

  private subscription: Subscription;

  infoValues : messageInfoCard = new messageInfoCard();

  constructor(private messageMan: InfoCardMan) {
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        this.infoValues = message.value;
        if (localStorage.getItem('birthday') === null) {
          localStorage.setItem('rawBirthday',message.value.fechaNacimiento);
          this.infoValues.fechaNacimiento = this.formatDate(message.value.fechaNacimiento);
          localStorage.setItem('birthday',this.infoValues.fechaNacimiento);
          localStorage.setItem('name',this.infoValues.nombreCliente);
          localStorage.setItem('rfc',this.infoValues.rfcCliente);
        }
      }
    )
  }

  formatDate(date:string):string{
    let values = date.split("-", 3);
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
  }


  ngOnInit() {
  }


}
