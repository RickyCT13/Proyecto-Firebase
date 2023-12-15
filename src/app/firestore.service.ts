import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// npm install firebase @angular/fire --save

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  public insertar(coleccion: any, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion: any) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }
  
  public borrar(coleccion: any, documentId: string) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }
  
  public actualizar(coleccion: any, documentId: any, datos: any) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
  }
}
