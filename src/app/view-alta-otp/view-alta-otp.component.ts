import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-alta-otp',
  templateUrl: './view-alta-otp.component.html',
  styleUrls: ['./view-alta-otp.component.scss',
              '../app.component.scss']
})
export class ViewAltaOtpComponent implements OnInit {

  constructor(
    private stepMan: StepMan,
    private alertMan: AlertMan,
    private route: ActivatedRoute,
    public spinnerMng : SpinnerMan
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(3,"Lo estamos autenticando");
  }

}
