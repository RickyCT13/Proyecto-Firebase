import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tareaEditando = {} as Tarea;

  arrayColeccionTareas: any = [
    {
      id: '',
      data: {} as Tarea,
    },
  ];

  idTareaSelec: string | undefined;

  constructor(private firestoreService: FirestoreService) {
    this.obtenerListaTareas();
  }

  clicBotonInsertar() {
    //this.firestoreService.insertar("tareas", this.tareaEditando);
    this.firestoreService.insertar('tareas', this.tareaEditando).then(
      () => {
        console.log('Tarea creada correctamente!');
        this.tareaEditando = {} as Tarea;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  obtenerListaTareas() {
    this.firestoreService
      .consultar('tareas')
      .subscribe((resultadoConsultaTareas) => {
        this.arrayColeccionTareas = [];
        resultadoConsultaTareas.forEach((datosTarea: any) => {
          this.arrayColeccionTareas.push({
            id: datosTarea.payload.doc.id,
            data: datosTarea.payload.doc.data(),
          });
        });
      });
  }

  selecTarea(tarea: any) {
    console.log('Tarea seleccionada: ' + tarea);
    this.idTareaSelec = tarea.id;
    this.tareaEditando.titulo = tarea.data.titulo;
    this.tareaEditando.descripcion = tarea.data.descripcion;
  }

  clicBotonBorrar() {
    if (this.idTareaSelec !== undefined) {
      this.firestoreService.borrar('tareas', this.idTareaSelec).then(() => {
        this.obtenerListaTareas();
        this.tareaEditando = {} as Tarea;
      });
    }
  }
}