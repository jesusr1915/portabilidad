import { Component, OnInit } from '@angular/core';
import { TerminosClass} from 'interfaces/copiesInterface';
import { TermMan } from '../terms/termMng';

declare let ga: any;

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../app.component.scss','./terms.component.scss']
})
export class TermsComponent implements OnInit {
  public visible = false;
  public visibleAnimate = false;
  terminosText : TerminosClass = new TerminosClass();

  constructor(
    private termsMng: TermMan
  ) { }

  ngOnInit() {
    this.hide();
  }
  public show(message: TerminosClass): void {
    this.terminosText = message;
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);

    ga('send', 'event', {
      eventCategory: 'terminosModal',
      eventAction: 'visualizar',
      eventValue: 1
    });

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
