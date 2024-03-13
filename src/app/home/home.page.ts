import { Component } from '@angular/core';
import { Persona } from '../persona';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  personaEdit = {} as Persona;

  arrayColeccionPersonas: any = [
    {
      id: '',
      data: {} as Persona,
    },
  ];

  idSelec: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.obtenerListaPersonas();
  }

  obtenerListaPersonas() {
    this.firestoreService
      .consultar('Personas')
      .subscribe((resultadoConsultaPersonas) => {
        this.arrayColeccionPersonas = [];
        resultadoConsultaPersonas.forEach((datosPersona: any) => {
          this.arrayColeccionPersonas.push({
            id: datosPersona.payload.doc.id,
            data: datosPersona.payload.doc.data(),
          });
        });
      });
  }

  selecPersona(idPersona: string, personaSelec: Persona) {
    this.personaEdit = personaSelec;
    this.idSelec = idPersona;
    // Redireccionar a página de detalle de persona
    this.router.navigate(['/detalle', this.idSelec]);
  }

  /*llamar(telefono: string) {
    this.callNumber
      .callNumber(telefono, false)
      .then((response) => console.log('Listo para llamar', response))
      .catch((error) => console.error('Error preparando la llamada', error));
  }*/
}
