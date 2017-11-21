import { Component, OnInit } from '@angular/core';
import { terminos_class} from 'interfaces/copiesInterface';
import { TermMan } from '../terms/termMng';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../app.component.scss','./terms.component.scss']
})
export class TermsComponent implements OnInit {
  public visible = false;
  private visibleAnimate = false;
  terminosText : terminos_class = new terminos_class();

  constructor(
    private termsMng: TermMan
  ) { }

  ngOnInit() {
    this.hide();
  }
  public show(message: terminos_class): void {
    this.terminosText = message;
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public returnSubmit(){
    this.termsMng.sendMessage(true);
    this.hide();
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

}
