export interface Relation {
  estatus: string;
  descripcion: string;
  datos: DatosClass;
}

export class DatosClass {
  seleccionCuenta: SeleccionCuentaClass;
  terminos : TerminosClass;
  terminos2 : TerminosClass;
  terminosCancelacion: TerminosClass;
  verifique : VerifiqueClass;
  constructor(){
    this.seleccionCuenta = new SeleccionCuentaClass();
    this.terminos = new TerminosClass();
    this.terminos2 = new TerminosClass();
    this.verifique = new VerifiqueClass();
  }
}
export class SeleccionCuentaClass{
  title: string;
  textInst1: string;
  textInst2: string;
  radioText1: string;
  radioText2: string;
  textInstClabe: string;
  textPlaceHolderClabe: string;
  textInstDebito: string;
  textPlaceHolderDebito: string;
  textInstBanco: string;
  textInstDatos: string;
  textNote: string;

  constructor(){
    this.title = "";
    this.textInst1 = "";
    this.textInst2 = "";
    this.radioText1 = "";
    this.radioText2 = "";
    this.textInstClabe = "";
    this.textPlaceHolderClabe = "";
    this.textInstDebito = "";
    this.textPlaceHolderDebito = "";
    this.textInstBanco = "";
    this.textInstDatos = "";
    this.textNote = "";
  }
}
export class TerminosClass{
  texto: string;

  constructor(){
    this.texto = "";
  }
}
export class VerifiqueClass{
  titleInit: string;
  titleStrong: string;
  titleEnd: string;
  instLbl: string;
  inst2Lbl: string;
  infoCount: string;
  infoBank: string;
  infoBirthdate: string;
  inst2LblInit: string;
  inst2LblStrong: string;
  inst3LblInit: string;
  inst3LblStrong: string;
  btnBack: string;
  btnCont: string;

  constructor(){
    this.titleInit = "";
    this.titleStrong = "";
    this.titleEnd = "";
    this.instLbl = "";
    this.infoCount = "";
    this.infoBank = "";
    this.infoBirthdate = "";
    this.inst2Lbl = "";
    this.inst2LblInit = "";
    this.inst2LblStrong = "";
    this.inst3LblInit = "";
    this.inst3LblStrong = "";
    this.btnBack = "";
    this.btnCont = "";

  }
}
