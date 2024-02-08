import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Persona } from '../persona';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { error } from 'console';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  idSelec: string = '';

  imagenSelec: string = '';

  new: boolean = false;

  document: any = {
    id: '',
    data: {} as Persona,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
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
          });
      }
    } else {
      this.new = true;
    }
  }

  clicBotonInsertar() {
    //this.firestoreService.insertar("Personas", this.document.data);
    this.firestoreService.insertar('Personas', this.document.data).then(
      () => {
        console.log('Persona creada correctamente!');
        this.document.data = {} as Persona;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async clicBotonBorrar() {
    const alert = await this.alertController.create({
      header: 'Confirmación de borrado',
      message: '¿Está seguro/a de que desea borrar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Se ha cancelado el borrado');
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.firestoreService.borrar('Personas', this.idSelec).then(
              () => {
                this.document.data = {} as Persona;
                this.idSelec = '';
                this.navController.navigateBack('/home');
                console.log('Se ha borrado el registro correctamente');
              },
              (error) => {
                console.error(error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
  clicBotonActualizar() {
    this.firestoreService
      .actualizar('Personas', this.idSelec, this.document.data)
      .then(() => {
        console.log('Persona editada correctamente.');
      });
  }
  /*
    Método para seleccionar una imagen
    Guarda la información de la imagen en Base64
  */
  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no lo tiene, se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker
            .getPictures({
              maximumImagesCount: 1, // Permitir sólo una imagen
              outputType: 1, // 1 -> Base64
            })
            .then(
              (results) => {
                if (results.length > 0) {
                  // Si se ha elegido una imagen
                  // Almacena la imagen seleccionada en la variable imagenSelec
                  this.imagenSelec = `data:image/jpeg;base64,${results[0]}`;
                  // Imprime por consola la cadena en Base64
                  console.log(
                    `Valor en Base64 de la imagen seleccionada: ${this.imagenSelec}`
                  );
                }
              },
              (error) => {
                console.error(error);
              }
            );
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  async subirImagen() {
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Espere, por favor...',
    });

    // Mensaje de subida de imagen exitosa
    const toast = await this.toastController.create({
      message: 'Imagen subida con éxito',
      duration: 3000,
    });

    // Carpeta en el Storage donde se guardará la imagen
    let nombreCarpeta = 'imagenes';

    // Mostrar mensaje de espera
    loading.present();

    // Asignar nombre en función de fecha y hora actual
    let nombreImagen = `${new Date().getTime()}`;

    // Llamar al método para subir la imagen
    this.firestoreService
      .subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          //  La variable downloadURL contiene la dirección URL de la imagen
          console.log(`downloadURL: ${downloadURL}`);

          // Mensaje de finalización de subida
          toast.present();

          // Ocultar mensaje de espera
          loading.dismiss();
        });
      });
  }
  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'Archivo eliminado con éxito',
      duration: 3000,
    });
    this.firestoreService.eliminarArchivoPorURL(fileURL).then(
      () => {
        toast.present();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
