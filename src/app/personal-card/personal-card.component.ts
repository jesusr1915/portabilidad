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
        this.formatDate(this.infoValues.fechaNacimiento);
      }
    )
  }

  formatDate(date:string){
    console.log(date);
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
    this.infoValues.fechaNacimiento = values[2]+" "+month[index]+" "+values[0];
  }


  ngOnInit() {
  }


}
