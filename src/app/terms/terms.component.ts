import { Component, OnInit } from '@angular/core';
import { terminos_class} from 'interfaces/copiesInterface';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../app.component.scss','./terms.component.scss']
})
export class TermsComponent implements OnInit {
  public visible = false;
  private visibleAnimate = false;
  terminosText : terminos_class = new terminos_class();

  constructor() { }

  ngOnInit() {
    this.hide();
  }
  public show(message: terminos_class): void {
    this.terminosText = message;
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
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
