import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-botones-alerta',
  templateUrl: './botones-alerta.component.html',
  styleUrls: ['./botones-alerta.component.scss'],
})
export class BotonesAlertaComponent  implements OnInit {

  public botonesAlerta = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Se ha cancelado la alerta');
      },
    },
    {
      text: 'Confirmar',
      role: 'confirm',
      handler: () => {
        console.log('Se ha confirmado la alerta');
      }
    }
  ];

  constructor() { }

  ngOnInit() {}

}
