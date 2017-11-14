import { Component, OnInit, Input } from '@angular/core';
import { CopiesService } from '../services/copiesService';
import { StepMan } from '../stepper/stepMan';
import { verifique_class } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';


@Component({
  selector: 'app-view-verifique',
  templateUrl: './view-verifique.component.html',
  styleUrls: ['../app.component.scss',
      './view-verifique.component.scss'
              ]
})
export class ViewVerifiqueComponent implements OnInit {

  copiesVer : verifique_class = new verifique_class();
  @Input() valueInfo = "8263130046528839";
  @Input() valueBank = "BANORTE";
  @Input() valueBirthdate = "28/NOVIEMBRE/1979";

  demo : Demo = new Demo(
    "popis",
    "SantanderSelect",
    "12341242412441",
    "30.00",
    "MXN",
    "5555040522"
  );

  constructor(
    public copiesServ: CopiesService,
    public stepMan: StepMan,
    public messageMan: MessageMan
  ) { }

  ngOnInit(){
    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.copiesVer = res.datos.verifique;

        this.stepMan.sendMessage(2);

        this.messageMan.sendMessage(this.demo);
      }
    )
  }
}
export class Demo {
  alias : string;
  tipoProducto : string;
  numeroCuenta : string;
  disponible: string;
  divisa: string;
  cuentaMovil: string;


  constructor(
    alias:string,
    tipoProducto:string,
    numeroCuenta:string,
    disponible: string,
    divisa: string,
    cuentaMovil: string
  ){
    this.alias = alias;
    this.tipoProducto = tipoProducto;
    this.numeroCuenta = numeroCuenta;
    this.disponible = disponible;
    this.divisa = divisa;
    this.cuentaMovil =  cuentaMovil;
  }
}
