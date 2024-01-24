import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Persona } from '../persona';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  personaEdit = {} as Persona;

  idSelec: string = '';

  new: boolean = false;

  document: any = {
    id: '',
    data: {} as Persona,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.idSelec = idRecibido;

      if (this.idSelec === 'new') {
        this.new = true;
      } else {
        // Consulta a la base de datos para obtener los datos asociados a esa id
        this.firestoreService
          .consultarPorId('Personas', this.idSelec)
          .subscribe((resultado: any) => {
            // Comprobar si existe un documento con esa id
            if (resultado.payload.data() != null) {
              // Si es así, recuperar los datos del documento
              this.document.id = resultado.payload.id;
              this.document.data = resultado.payload.data();
            } else {
              // De lo contrario, vaciar los datos que hubiera
              this.document.data = {} as Persona;
            }
          }
        );
      }
    } else {
      this.new = true;
    }
  }

  clicBotonInsertar() {
    //this.firestoreService.insertar("Personas", this.personaEdit);
    this.firestoreService.insertar('Personas', this.personaEdit).then(
      () => {
        console.log('Persona creada correctamente!');
        this.personaEdit = {} as Persona;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  clicBotonBorrar() {
    this.firestoreService.borrar('Personas', this.idSelec).then(
      () => {
        this.personaEdit = {} as Persona;
        this.idSelec = '';
      },
      (error) => {
        console.error(error);
      }
    );
  }
  clicBotonActualizar() {
    this.firestoreService
      .actualizar('Personas', this.idSelec, this.personaEdit)
      .then(() => {
        console.log('Persona editada correctamente.');
      });
  }
}
