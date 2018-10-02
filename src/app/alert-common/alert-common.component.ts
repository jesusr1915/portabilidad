import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

/**
 * Clase pricipal para el servicio de mensajes
 */
import { MessageService } from '../services/message.service';

/**
 * Interfaz común para poder realizar el llamado de mensajes
 */
import { AlertMessage } from '../../interfaces/alert-message';


@Component({
  selector: 'app-alert-common',
  templateUrl: './alert-common.component.html',
  styleUrls: ['./alert-common.component.scss']
})

/**
 * Componente que presenta un mensaje al usuario
 * - Tiene 2 acciones de aceptar y cancelar, estás 2 opciones
 * emiten un dato tipo genérico para ser procesado por quién
 * quien use el componente
 */
export class AlertCommonComponent implements OnInit {

  /**
   * Acción lanzada al pulsar aceptar
   */
  @Output() onAcceptClicked: EventEmitter<any> = new EventEmitter();

  /**
   * Acción lanzada al pulsar cancelar
   */
  @Output() onCancelClicked: EventEmitter<any> = new EventEmitter();

  /**
   * Oculta o muestra contenido
   */
  visible = false;

  /**
   * Efecto de animación para mostrar una transición
   */
  visibleAnimate = false;

  /**
   * Para mostrar botón segúndo botón
   */
  twoButtons = false;

  /**
   * Icóno
   */
  icon = "";

  /**
   * Referencia principal para contener mensaje y comincarlo a los eventos
   */
  message: AlertMessage;


  /**
   * Referencia para subscribir/desubscribir al servicio de mensaje
   */
  private subscription: Subscription;

  /**
   * - Referencia a servicios
   * - Subscribción a servicio de mensajes
   *
   * @param messageService MessageService
   */
  constructor(
    private messageService: MessageService
  ) {
    this.subscription = this.messageService.getMessage()
      .subscribe(
        (message: AlertMessage) => {
          this.showMessage(message);
        }
      )
  }

  ngOnInit() {

  }

  /**
   * Elimina subscripción a servicio de mensajes
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * - Emite acción de Aceptar hacia el componente padre
   * - Envia el dato [any] referenciado al momento de crear el mensaje
   * hacia el componte padre
   */
  aceptar() {
    this.hide();
    this.onAcceptClicked.emit(this.message.item);
  }

  /**
   * - Emite acción de Cancelar hacia el componente padre
   * - Envia el dato [any] referenciado al momento de crear el mensaje
   * hacia el componte padre
   */
  cancelar() {
    this.hide();
    this.onCancelClicked.emit(this.message.item);
  }

  /**
   * Muestra mensaje
   * - Recibe Interface que contiene mensaje para alerta
   * @param mensaje AlertMessage
   */
  showMessage(mensaje: AlertMessage): void {
    this.message = mensaje;
    this.icon = "assets/imgs/ico-info.svg";
    if (this.message.buttonCancel) {
      this.twoButtons = true;
    }
    this.visible = true;
    this.visibleAnimate = true;
    // setTimeout(() => this.visible = true, 1000);
  }

  /**
   * Oculta mensaje de alerta
   */
  hide(): void {
    this.visible = false;
    this.visibleAnimate = false;
    // setTimeout(() => this.visible = false, 1000);
  }

}
