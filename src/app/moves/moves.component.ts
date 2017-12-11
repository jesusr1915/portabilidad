import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['../app.component.scss','./moves.component.scss']
})
export class MovesComponent implements OnInit {

  @Input() valueOrigin;
  @Input() valueDestination;
  @Input() valueStatus;
  @Input() valueDelivery;

  @Input() imagePath;
  classDelivery;

  constructor() { }

  ngOnInit() {
    if(this.valueDelivery=="R"){
      this.classDelivery = "rejected";
      this.imagePath="assets/imgs/arrow-green.svg";
    }else{
      this.classDelivery = "accept";
      this.imagePath="assets/imgs/arrow-orange.svg";
    }
  }

}
