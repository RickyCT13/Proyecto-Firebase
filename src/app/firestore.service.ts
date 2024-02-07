import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
// npm install firebase @angular/fire --save

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage
  ) {}

  public insertar(coleccion: string, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion: string) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public consultarPorId(coleccion: string, documentId: string) {
    return this.angularFirestore
      .collection(coleccion)
      .doc(documentId)
      .snapshotChanges();
  }

  public borrar(coleccion: string, documentId: string) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion: string, documentId: string, datos: any) {
    return this.angularFirestore
      .collection(coleccion)
      .doc(documentId)
      .set(datos);
  }

  /*
    Manejo de imágenes
  */
  
  /*
    Método para subir imágenes al Storage de nuestro proyecto.
  */
  public subirImagenBase64(nombreCarpeta: string, nombreArchivo: string, imagenBase64: string) {
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  /*
    Método para borrar un archivo dada su URL
  */
  public eliminarArchivoPorURL(url: string) {
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }
}
