import { Component } from '@angular/core';
import { Persona } from '../persona';
import { FirestoreService } from '../firestore.service';

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

  idPersonaSelec: string | undefined;

  visible: boolean = true;

  constructor(private firestoreService: FirestoreService) {
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

  selecPersona(Persona: any) {
    console.log('Persona seleccionada: ' + Persona);
    this.idPersonaSelec = Persona.id;
    this.personaEditando.nombre = Persona.data.nombre;
    this.personaEditando.apellidos = Persona.data.apellidos;
    this.personaEditando.fechaNacimiento = Persona.data.fechaNacimiento;
    this.personaEditando.dni = Persona.data.dni;
    this.personaEditando.email = Persona.data.email;
    this.personaEditando.direccion = Persona.data.direccion;
    this.personaEditando.codPostal = Persona.data.codPostal;
    this.personaEditando.poblacion = Persona.data.poblacion;
    this.personaEditando.provincia = Persona.data.provincia;
    this.personaEditando.telefono = Persona.data.telefono;
  }

  clicBotonBorrar() {
    if (this.idPersonaSelec !== undefined) {
      this.firestoreService.borrar('Personas', this.idPersonaSelec).then(() => {
        this.obtenerListaPersonas();
        this.personaEditando = {} as Persona;
      });
    }
  }
  clicBotonActualizar() {
    this.firestoreService.actualizar('Personas', this.idPersonaSelec, this.personaEditando).then(() => {
      this.obtenerListaPersonas();
      this.personaEditando = {} as Persona;
    });
  }

  visibilidad() {
    this.visible = (!this.visible);
  }
}