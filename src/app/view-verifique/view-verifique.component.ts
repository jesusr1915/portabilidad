import { Component, OnInit, Input } from '@angular/core';
import { CopiesService } from '../services/copiesService';
import { StepMan } from '../stepper/stepMan';
import { verifique_class } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';


@Component({
  selector: 'app-view-verifique',
  templateUrl: './view-verifique.component.html',
  styleUrls: ['../app.component.scss',
      './view-verifique.component.scss'
              ]
})
export class ViewVerifiqueComponent implements OnInit {

  copiesVer : verifique_class = new verifique_class();
  @Input() valueInfo = localStorage.getItem('tarjet');
  @Input() valueBank = localStorage.getItem('banco');
  @Input() valueBirthdate = localStorage.getItem('birthday');

  demo : Demo = new Demo(
    localStorage.getItem("cardAlias"),
    "SantanderSelect",
    localStorage.getItem("cardNumeroCuenta"),
    localStorage.getItem("cardDisponible"),
    localStorage.getItem("cardDivisa"),
    localStorage.getItem("cardCuentaMovil")
  );

  constructor(
    private copiesServ: CopiesService,
    private stepMan: StepMan,
    private messageMan: MessageMan,
    private tokenMng: TokenMng
  ) { }

  ngOnInit(){
    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.copiesVer = res.datos.verifique;

        this.stepMan.sendMessage(2,"Portabilidad de Nómina");

        this.messageMan.sendMessage(this.demo);
        if(this.valueInfo.length == 18){
          this.copiesVer.infoCount = "CLABE Interbancaria";
        }else{
          this.copiesVer.infoCount = "Tarjeta de débito";
        }
      }
    )


  }
  showToken(){
    this.tokenMng.sendMessage("true");
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
