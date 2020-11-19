import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  
  public insertar(coleccion, datos) {
    return this.angularFirestore.collection(coleccion).add(datos);
  } 

  //Consultar Cualquier Coleccion
  public consultar(coleccion) {
    return this.angularFirestore.collection(coleccion).valueChanges();
  }


  //Consultar Coleccion Concreta
  public leerArticulosCat(coleccion, cat) {

    return this.angularFirestore.collection(coleccion).ref.where('categoria', "==", cat)
    

  }
}
