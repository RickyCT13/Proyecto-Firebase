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
  personaEditando = {} as Persona;

  arrayColeccionPersonas: any = [
    {
      id: '',
      data: {} as Persona,
    },
  ];

  idPersonaSelec: string = "";

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaPersonas();
  }

  clicBotonInsertar() {
    //this.firestoreService.insertar("Personas", this.personaEditando);
    this.firestoreService.insertar('Personas', this.personaEditando).then(
      () => {
        console.log('Persona creada correctamente!');
        this.personaEditando = {} as Persona;
      },
      (error) => {
        console.error(error);
      }
    );
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
    this.personaEditando = personaSelec;
    this.idPersonaSelec = idPersona;
    // Redireccionar a página de detalle de persona
    this.router.navigate(['/detalle', this.idPersonaSelec]);
    
  }

  clicBotonBorrar() {
      this.firestoreService.borrar('Personas', this.idPersonaSelec).then(() => {
        this.personaEditando = {} as Persona;
        this.idPersonaSelec = '';
      },
      (error) => {
        console.error(error);
      });
  }
  clicBotonActualizar() {
    this.firestoreService.actualizar('Personas', this.idPersonaSelec, this.personaEditando).then(() => {
      console.log('Persona editada correctamente.');
    });
  }
}