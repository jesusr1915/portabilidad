import { Injectable } from '@angular/core';
/**
 * Clase principal apra el paso de mensajes
 */
import { MessageService } from './message.service';

/**
 * Interfaz común para paso me mensajes en alertas
 */
import { AlertMessage } from '../../interfaces/alert-message';

@Injectable()
export class MainService {

  constructor(
    private messageService: MessageService
  ) { }

  showAlert(message?: AlertMessage): void {
    const msg: AlertMessage = message ? {
      title: message.title,
      body: message.body,
      buttonAccept: message.buttonAccept || 'Aceptar',
      buttonCancel: message.buttonCancel || null,
      item: message.item || null
    } as AlertMessage : {
      title: '',
      body: '',
      buttonAccept: '',
      buttonCancel: null,
      item: null
    } as AlertMessage;
    this.messageService.sendMessage(msg);
  }

}
