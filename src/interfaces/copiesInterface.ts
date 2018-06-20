export interface Relation {
  estatus: string;
  descripcion: string;
  datos: datos_class;
}

export class datos_class {
  seleccion_cuenta: seleccion_cuenta_class;
  terminos : terminos_class;
  terminos2 : terminos_class;
  verifique : verifique_class;
  constructor(){
    this.seleccion_cuenta = new seleccion_cuenta_class();
    this.terminos = new terminos_class();
    this.terminos2 = new terminos_class();
    this.verifique = new verifique_class();
  }
}
export class seleccion_cuenta_class{
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
export class terminos_class{
  texto: string;

  constructor(){
    this.texto = "";
  }
}
export class verifique_class{
  titleinit: string;
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
    this.titleinit = "";
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
